<template>
  <div class="index">
    <img v-if="IN_FRAME" src="../../../icons/iframe/sendAndReceive.svg" />
    <div v-else class="not-iframe">
      <img src="../../../icons/hypersign-logo.png" :class="{ logo: !IS_WEB }" />
      <!-- <Component :is="IS_WEB ? 'SuperheroLogo' : 'Logo'" :class="{ logo: !IS_WEB }" /> -->
      <!-- <span :class="{ blue: IS_WEB }" class="heading-color">
        {{ $t('pages.index.heading') }}
      </span>
      <template v-if="IS_WEB">
        <Platforms class="heading-color">
          {{ $t('pages.index.platforms.heading') }}
        </Platforms>
        <span class="heading-color">{{ $t('pages.index.webVersion') }}</span>
      </template> -->
    </div>
    <div class="">
      <Input
        placeholder="Name"
        label=""
        v-model="profile.name"
        :disabled="ifAllDisabled"
      />
      <Input
        placeholder="Email"
        label=""
        v-model="profile.email"
        :disabled="ifAllDisabled"
      /></div>
    <CheckBox v-model="termsAgreed" data-cy="checkbox" style="padding: 20px;">
      <span class="heading-color">
        {{ $t('pages.index.term1') }}
        <RouterLink to="/termsOfService" data-cy="terms">
          {{ $t('pages.index.termsAndConditions') }}
        </RouterLink>
      </span>
    </CheckBox>

    <Button @click="createWallet" :disabled="!termsAgreed" data-cy="generate-wallet">
      {{ $t('pages.index.generateWallet') }}
    </Button>
    <!-- <Button
      @click="$router.push('/importAccount')"
      :disabled="!termsAgreed"
      data-cy="import-wallet"
    >
      {{ $t('pages.index.importWallet') }}
    </Button> -->
  </div>
</template>

<script>
import { IN_FRAME } from '../../utils/helper';
import Logo from '../../../icons/hypersign-logo.png?vue-component';
import SuperheroLogo from '../../../icons/hypersign-logo.png?vue-component';
import CheckBox from '../components/CheckBox';
import Button from '../components/Button';
import Platforms from '../components/Platforms';
import axios from 'axios';
import { hypersignSDK } from '../../utils/hypersign';
import { HS_NODE_BASE_URL, HS_NODE_DID_REGISTER_API } from '../../utils/hsConstants';
import { generateMnemonic, mnemonicToSeed } from '@aeternity/bip39';
import Input from '../components/Input-light';
import registration from '../../../mixins/registration';

export default {
  mixins: [registration],
  components: { Logo,Input, SuperheroLogo, CheckBox, Button, Platforms },
  data: () => ({
    termsAgreed: false,
    IS_WEB: process.env.PLATFORM === 'web',
    IN_FRAME,
  }),
  methods: {
    async createWallet() {
      this.mnemonic = generateMnemonic();
      const seed = mnemonicToSeed(this.mnemonic).toString('hex');
      const address = await this.$store.dispatch('generateWallet', { seed });
      this.$store.commit('setMnemonic', this.mnemonic);
      const keypair = {
        publicKey: address,
        privateKey: seed,
      };

      ////HYPERSIGN Related
      ////////////////////////////////////////////////
      try {
        this.loading = true;
        // We will not use native aeternity keys, instead will use hypersign keys.
        // The reason to do this, because giving flexibility to use different algorithm for keys
        const newKeyPair = await hypersignSDK.did.generateKeys();
        const hskeys = {
          publicKey: newKeyPair.publicKey.publicKeyBase58,
          privateKey: newKeyPair.privateKeyBase58,
        };

        const HS_CORE_DID_REGISTER = `${HS_NODE_BASE_URL}${HS_NODE_DID_REGISTER_API}`;
        //console.log(HS_CORE_DID_REGISTER);
        await axios
          .get(`${HS_CORE_DID_REGISTER}?publicKey=${hskeys.publicKey}`)
          .then(result => {
            result = result.data;
            if (!result) throw new Error('Could not fetch from hypersign');
            if (result && result.error) throw new Error(result.error);
            const { keys, did } = result.message;
            keys['privateKeyBase58'] = hskeys.privateKey;
            this.$store.commit('setHSkeys', {
              keys,
              did,
            });

            this.loading = false;
          })
          .catch(console.error);
      } catch (e) {
        this.loading = false;
      }
      ////HYPERSIGN Related
      ////////////////////////////////////////////////

      await this.$store.dispatch('setLogin', { keypair });
      await this.setupProfile();
      this.$router.push(this.$store.state.loginTargetLocation)
      // this.next();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../../common/variables';
input.input {
    /* display: block; */
    width: 100%;
    /* border-radius: 5px; */
    border-bottom: 2px solid #bbb!important;
    background: #f1f1f1!important;
    padding-left: 0px;
    margin-bottom: 22px;
    color: #3e3e3e!important;
    font-size: 14px;
    min-height: 35px;
    /* margin-left: auto; */
    /* margin-right: auto; */
}
.input-wrapper {
  width:282px;
  margin:auto;
}
.checkmark {
    height: 15px !important;
    width: 15px  !important;
}
.index {

  .checkbox-container {
    margin: 0 auto 25px auto;
    max-width: 282px;
    font-size: 12px;
    ::v-deep .checkmark {
      margin-right: 5px;
    }
  }
  .heading-color{
    color: $text-color !important;
  }
  .primary-button {
    width: 282px;

    &:hover {
      background: #4aabff;
    }

    &:first-of-type {
      margin-bottom: 20px;
    }
  }

  .not-iframe {
    font-size: 16px;
    width: 312px;
    margin: 0 auto;
    text-align: center;

    span {
      margin: 15px 0;
      display: block;
      font-weight: 600;

      &.blue {
        margin-top: 0;
        color: $button-color;
      }
    }

    .platforms {
      border-radius: 10px;
    }
  }
}
</style>
