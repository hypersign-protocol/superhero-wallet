import Vue from 'vue';
import Vuex from 'vuex';
import VueRx from 'vue-rx';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import observables from './plugins/observables';
import persistState from './plugins/persistState';
import modals from './plugins/modals';
import tipUrl from './plugins/tipUrl';
import accounts from './plugins/account';
import tokens from './plugins/tokens';
import names from './plugins/names';
import runMigrations from './migrations';
import invitesModule from './modules/invites';
import { defaultNetwork } from '../popup/utils/constants';

Vue.use(Vuex);
Vue.use(VueRx);

const initialState = {
    isRestored: false,
    account: {},
    mnemonic: null,
    activeAccount: 0,
    balance: 0,
    current: {
        network: defaultNetwork.name,
        language: 'en',
        token: 0,
        currency: 'usd',
    },
    userNetworks: [],
    isLoggedIn: false,
    transactions: {
        latest: [],
        pending: [],
    },
    sdk: null,
    middleware: null,
    tipping: null,
    tippingAddress: null,
    mainLoading: true,
    nodeStatus: 'connecting',
    currencies: {},
    nextCurrenciesFetch: null,
    notifications: [],
    notificationSettings: [],
    chainNames: null,
    tip: null,
    txQueue: [],
    connectedAepps: {},
    migrations: {},
    backedUpSeed: null,
    tourRunning: false,
    tourStartBar: true,
    saveErrorLog: true,
    loginTargetLocation: { name: 'account' },
    hypersign: {
        did: "",
        keys: {},
        credentials: [],
        credentialsTemp: [],
        requestingAppInfo: '',
        profile: {},
        hsAuthDID: ""
    },
};

export default new Vuex.Store({
    state: {...initialState },
    getters,
    mutations: {
        setState(state, newState) {
            Object.entries({...state, ...newState }).forEach(([name, value]) =>
                Vue.set(state, name, value),
            );
        },
        resetState(state) {
            Object.entries({...initialState, isRestored: true }).forEach(([name, value]) =>
                Vue.set(state, name, value),
            );
        },
        ...mutations,
    },
    actions,
    plugins: [
        persistState(
            runMigrations,
            ({
                migrations,
                current,
                transactions,
                balance,
                currencies,
                userNetworks,
                names: { owned, defaults } = {},
                nextCurrenciesFetch,
                tip,
                connectedAepps,
                backedUpSeed,
                account,
                mnemonic,
                saveErrorLog,
                tourStartBar,
                tokens: { all },
                invites,
                notificationSettings,
                hypersign
            }) => ({
                migrations,
                current,
                transactions,
                balance,
                currencies,
                userNetworks,
                names: { owned, defaults },
                nextCurrenciesFetch,
                tip,
                connectedAepps,
                backedUpSeed,
                account,
                mnemonic,
                saveErrorLog,
                tourStartBar,
                tokens: { all },
                invites,
                notificationSettings,
                hypersign
            }),
        ),
        // observables,
        modals,
        tipUrl,
        accounts,
        tokens,
        names,
    ],
    modules: {
        invites: invitesModule,
    },
});