<template>
  <div class="height-100 primary-bg">
    <div class="popup popup-no-padding">
      <Loader v-if="loading" />
      <div v-if="!backedUpSeed && !tourRunning" class="noti" data-cy="seed-notif">
      </div>
      <div class="tour__step1">
        <AccountInfo />
        <!-- <BalanceInfo /> -->
      </div>
      <div class="submenu-bg">
        <BoxButton
          :text="$t('pages.appVUE.profile')"
          to="/profile"
          style="font-size: smaller; color: white"
          class="tour__step9"
        >
          <Profile width="24.5" height="24.5" slot="icon" />
        </BoxButton>
        <BoxButton
          :text="$t('pages.appVUE.credential')"
          style="font-size: smaller; color: white"
          to="/credential"
          class="tour__step10"
        >
          <Credential width="24.5" height="24.5" slot="icon" color="white" />
        </BoxButton>
        <BoxButton :text="$t('pages.appVUE.settings')" to="/settings" class="tour__step8">
          <Settings slot="icon" />
        </BoxButton>
      </div>
      <!-- <RecentTransactions /> -->
      <div style="justify-content: center; display: flex">
        <Button @click="scan" class="scan scanner" data-cy="scan-button">
          <span style="margin-top: 4%"><QrIcon width="20" height="20" /></span>
          <span class="scan-text">{{ $t('pages.credential.scan') }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Settings from '../../../icons/settings-icon.svg?vue-component';

import Profile from '../../../icons/profile.svg?vue-component';
import Credential from '../../../icons/credential.svg?vue-component';
import QrIcon from '../../../icons/qr-code.svg?vue-component';
import AccountInfo from '../components/AccountInfo';
import BoxButton from '../components/BoxButton';
import axios from 'axios';

export default {
  name: 'Account',
  components: {
    QrIcon,
    Settings,
    AccountInfo,
    BoxButton,
    Credential,
    Profile,
  },
  data() {
    return {
      form: {
        url: '',
        amount: '',
      },
      credentialUrl: '',
      loading: false,
      verifiableCredential: {},
    };
  },
  computed: {
    ...mapState(['tourRunning', 'backedUpSeed']),
    ...mapGetters(['hypersign']),
  },
  methods: {
    async scan() {
      const QRData = await this.$store.dispatch('modals/open', {
        name: 'read-qr-code',
        title: this.$t('pages.credential.scan'),
      });
      let data;
      try {
        data = JSON.parse(QRData);
        this.credentialDetailsQRdata(data);
      } catch (e) {
        data = QRData;
        this.credentialsQRData(data);
      }
    },

    async fetchCredential() {
      this.credentialUrl = this.credentialUrl + '&did=' + this.hypersign.did;
      this.loading = true;
      let response = await axios.get(this.credentialUrl);
      response = response.data;
      if (!response) throw new Error('Can not accept credential');
      if (response && response.status != 200) throw new Error(response.error);
      if (!response.message) throw new Error('Can not accept credential');
      this.loading = false;
      return response.message;
    },

    async credentialsQRData(data) {
      try {       
        this.credentialUrl = data;
        let cred = await this.fetchCredential();

        // TODO: Check if this credential already exsits in wallet: otherwise reject
        const credInWallet = this.hypersign.credentials.find((x) => x.id == cred.id);
        if (credInWallet) {
          throw new Error('The credential already exist in your wallet');
        }

        // TODO: Check if you are the owner of this credenital: otherwise reject
        if (this.hypersign.did != cred.credentialSubject.id) {
          throw new Error('The credential is not issued to you');
        }

        this.$store.commit('addHSVerifiableCredentialTemp', cred);
        this.$router.push(`/credential/temp/${cred.id}`);
      } catch (e) {
        this.loading = false;
        if (e.message) this.$store.dispatch('modals/open', { name: 'default', msg: e.message });
      }
    },

    async credentialDetailsQRdata(qrData) {
      try {
        if (qrData == {}) throw new Error('Parsed QR data is empty');

        const { appDid, schemaId } = qrData;

        if (!schemaId) throw new Error('Invalid schemaId');
        this.$store.commit('addRequestingAppInfo', qrData);
        this.verifiableCredential = this.hypersign.credentials.find((x) => {
          const credentialSchemaUrl = x['@context'][1].hsscheme;
          const credentialSchemaId = credentialSchemaUrl.split('get/')[1].trim();
          if (x.issuer === appDid && credentialSchemaId === schemaId) return x;
        });

        if (!this.verifiableCredential) throw new Error('Credential not found');
        this.$router.push(`/credential/authorize/${this.verifiableCredential.id}`);
      } catch (e) {
        this.loading = false;
        if (e.message) this.$store.dispatch('modals/open', { name: 'default', msg: e.message });
      }
    },

    // async deeplink(url) {
    //   try {
    //     //console.log('deeplink...')
    //     this.form.url = url;
    //     await this.fetchCredential();
    //   } catch (e) {
    //     this.loading = false;
    //     if (e.message) this.$store.dispatch('modals/open', { name: 'default', msg:e.message });
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../common/variables';

.accountAddress {
  color: $white-color;
}

.paragraph {
  font-weight: normal;
}

.transactionHistory {
  margin-top: 1rem;
  width: 100%;
}

.recent-tx {
  margin-top: 130px;
  height: 500px;
  position: relative;
  z-index: 0;
}

.recent-tx .recent-transactions {
  overflow-y: scroll;
  padding-bottom: 20px;
}

.submenu-bg {
  background: $submenu-bg;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
}

.send-tips {
  margin-bottom: 26px;
}

.noti {
  margin-top: 20px;
  margin-bottom: 0;
  line-height: 14px;
}

.scan-text {
  margin-left: 10px;
  margin-bottom: 2px;
  // float: right;
}

.scanner {
  position: fixed;
  bottom: 0;
  width: 40%;
  border-radius: 49px;
}
</style>
