import Node from '@aeternity/aepp-sdk/es/node';
import MemoryAccount from '@aeternity/aepp-sdk/es/account/memory';
import { BrowserWindowMessageConnection } from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/connection/browser-window-message';
import { isEmpty } from 'lodash-es';
import store from '../store';
import { postMessage } from '../popup/utils/connection';
import {
  parseFromStorage,
  middleware,
  getAllNetworks,
  IN_FRAME,
  extractHostName,
} from '../popup/utils/helper';
import { TIPPING_CONTRACT, NO_POPUP_AEPPS } from '../popup/utils/constants';
import Logger from './logger';

let countError = 0;

async function initMiddleware() {
  const { network, current } = store.getters;
  store.commit('SET_MIDDLEWARE', (await middleware(network, current)).api);
  store.dispatch('names/fetchOwned');
}

async function logout() {
  store.commit('SET_ACTIVE_ACCOUNT', { publicKey: '', index: 0 });
  store.commit('UNSET_SUBACCOUNTS');
  store.commit('UPDATE_ACCOUNT', {});
  store.commit('SWITCH_LOGGED_IN', false);
}

async function getKeyPair() {
  const { activeAccount } = store.getters;
  const { account } = store.getters;
  const res = await postMessage({ type: 'getKeypair', payload: { activeAccount, account } });
  return res.error ? { error: true } : parseFromStorage(res);
}

async function initContractInstances() {
  if (!store.getters.mainnet && !process.env.RUNNING_IN_TESTS) return;
  const contractAddress = await store.dispatch('getTipContractAddress');
  store.commit(
    'SET_TIPPING',
    await store.getters.sdk.getContractInstance(TIPPING_CONTRACT, {
      contractAddress,
      forceCodeCheck: true,
    }),
  );
}

export default {
  async init() {
    const { account } = store.getters;
    if (isEmpty(account)) {
      store.commit('SET_MAIN_LOADING', false);
      return { loggedIn: false };
    }
    const address = await store.dispatch('generateWallet', { seed: account.privateKey });
    store.commit('UPDATE_ACCOUNT', account);
    store.commit('SET_ACTIVE_ACCOUNT', { publicKey: address, index: 0 });

    store.commit('SWITCH_LOGGED_IN', true);

    /* Get network */
    const networks = await getAllNetworks();
    store.commit('SET_NETWORKS', networks);

    store.commit('SET_MAIN_LOADING', false);
    return { loggedIn: true };
  },
  async initSdk() {
    const keypair = await getKeyPair();
    if (keypair.error) {
      await logout();
      return;
    }

    const { network, current } = store.getters;
    const { internalUrl, compilerUrl } = network[current.network];
    const node = await Node({
      url: internalUrl,
      internalUrl,
    });
    const account = MemoryAccount({ keypair });
    try {
      const { RpcWallet } = await import('@aeternity/aepp-sdk/es/ae/wallet');
      const acceptCb = (_, { accept }) => accept();
      const sdk = await RpcWallet.compose({
        methods: {
          address: async () => store.getters.account.publicKey,
          sign: data => store.dispatch('accounts/sign', data),
          signTransaction: (txBase64, opt) =>
            store.dispatch('accounts/signTransaction', { txBase64, opt }),
        },
      })({
        nodes: [{ name: current.network, instance: node }],
        accounts: [account],
        nativeMode: true,
        compilerUrl,
        name: 'Superhero',
        onConnection(client, { accept, deny }, origin) {
          if (NO_POPUP_AEPPS.includes(extractHostName(origin))) accept();
          else deny();
        },
        onSubscription: acceptCb,
        onSign: acceptCb,
        onMessageSign: acceptCb,
        onAskAccounts: acceptCb,
        onDisconnect(msg, client) {
          client.disconnect();
        },
      });

      if (IN_FRAME) {
        const connection = BrowserWindowMessageConnection({ target: window.parent });
        sdk.addRpcClient(connection);
        sdk.shareWalletInfo(connection.sendMessage.bind(connection));
        setTimeout(() => sdk.shareWalletInfo(connection.sendMessage.bind(connection)), 3000);
      }

      await store.dispatch('initSdk', sdk);
      await initContractInstances();
      await initMiddleware();
      store.commit('SET_NODE_STATUS', 'connected');
      setTimeout(() => store.commit('SET_NODE_STATUS', ''), 2000);
    } catch (e) {
      countError += 1;
      if (countError < 3) await this.initSdk();
      else {
        store.commit('SET_NODE_STATUS', 'error');
        Logger.write(e);
      }
    }
  },
};
