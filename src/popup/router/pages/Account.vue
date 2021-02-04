<template>
  <div class="height-100 primary-bg ">
    <div class="popup popup-no-padding">
      <Loader v-if="loading" />
      <div v-if="!backedUpSeed && !tourRunning" class="noti" data-cy="seed-notif">
        <!-- <span>
          {{ $t('pages.account.youNeedTo') }}
          <RouterLink :to="{ name: 'settings-security' }">{{
            $t('pages.account.backup')
          }}</RouterLink>
          {{ $t('pages.account.yourSeedPhrase') }}
        </span> -->
      </div>
      <div class="tour__step1">
        <AccountInfo />
        <!-- <BalanceInfo /> -->
      </div>
      <div class="submenu-bg">
        <!-- <BoxButton
          data-cy="tip-button"
          :text="$t('pages.account.send')"
          accent
          :disabled="!allowTipping"
          :to="allowTipping ? { name: 'tip' } : {}"
          class="tour__step2"
        >
          <Tip slot="icon" />
        </BoxButton>
        <BoxButton
          :text="$t('pages.account.claim')"
          accent
          :to="allowTipping ? { name: 'claim-tips' } : {}"
          :disabled="!allowTipping"
          class="tour__step4"
        >
          <Claim slot="icon" />
        </BoxButton> -->
        <!-- <BoxButton text="Activity" to="/transactions" class="tour__step5">
          <Activity slot="icon" />
        </BoxButton>
        <BoxButton :text="$t('pages.appVUE.invite')" :to="{ name: 'invite' }">
          <Invite slot="icon" />
        </BoxButton>
        <BoxButton :text="$t('pages.appVUE.topUp')" to="/receive" class="tour__step6">
          <Topup slot="icon" />
        </BoxButton>
        <BoxButton :text="$t('pages.appVUE.withdraw')" to="/send" class="tour__step7">
          <Withdraw slot="icon" />
        </BoxButton> -->
        
        <BoxButton :text="$t('pages.appVUE.profile')" to="/profile" style="font-size: smaller; color:white" class="tour__step9">
          <Profile width="24.5" height="24.5"  slot="icon" />
        </BoxButton>
        <BoxButton :text="$t('pages.appVUE.credential')" style="font-size: smaller; color:white" to="/credential" class="tour__step10">
          <Credential width="24.5" height="24.5" slot="icon" color="white"/>
        </BoxButton>
        <BoxButton :text="$t('pages.appVUE.settings')" to="/settings" class="tour__step8">
          <Settings slot="icon" />
        </BoxButton>
      </div>
      <!-- <RecentTransactions /> -->
      <div style="justify-content: center;display: flex;">
        <Button @click="scan" class="scan scanner"  data-cy="scan-button">
          <span style="margin-top: 4%;"><QrIcon width="20" height="20" /></span>
          <span class="scan-text">{{ $t('pages.credential.scan') }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
// import Tip from '../../../icons/tip-icon.svg?vue-component';
// import Claim from '../../../icons/claim-icon.svg?vue-component';
// import Activity from '../../../icons/activity-icon.svg?vue-component';
// import Topup from '../../../icons/topup-icon.svg?vue-component';
// import Invite from '../../../icons/invite.svg?vue-component';
// import Withdraw from '../../../icons/withdraw-icon.svg?vue-component';
import Settings from '../../../icons/settings-icon.svg?vue-component';

import Profile from '../../../icons/profile.svg?vue-component';
import Credential from '../../../icons/credential.svg?vue-component';
import QrIcon from '../../../icons/qr-code.svg?vue-component';
// import RecentTransactions from '../components/RecentTransactions';
// import BalanceInfo from '../components/BalanceInfo';
import AccountInfo from '../components/AccountInfo';
import BoxButton from '../components/BoxButton';
import Url from 'url-parse';
import axios from 'axios';
import { hypersignSDK } from '../../utils/hypersign';

export default {
  name: 'Account',
  components: {
    QrIcon,
    // Tip,
    // Claim,
    // Activity,
    // Topup,
    // Withdraw,
    Settings,
    // RecentTransactions,
    // BalanceInfo,
    AccountInfo,
    BoxButton,
    // Invite,
    Credential,
    Profile
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
      // try {
        //console.log('scanning...')
        const QRData = await this.$store.dispatch('modals/open', {
          name: 'read-qr-code',
          title: this.$t('pages.credential.scan'),
        });
        //console.log('scan method....')
        //console.log(QRData)
        let data;
        try{
          //console.log('Inside try....')
          data = JSON.parse(QRData);
          this.credentialDetailsQRdata(data);
        }catch(e){
          //console.log('Inside catch....')
          //console.log('Not a json, which means this is for credential detail')
          //console.log(e);
          data = QRData;
          this.credentialsQRData(data);
        }
        // if(typeof QRData == )
        
      // } catch (e) {
      //   this.loading = false;
      //   if (e.message) this.$store.dispatch('modals/open', { name: 'default', msg:e.message });
      // }
    },

    async fetchCredential(){
      //console.log('fetchCredential...')
        this.credentialUrl = this.credentialUrl + '&did=' + this.hypersign.did;
        //console.log(this.credentialUrl)
        this.loading = true;
        let response = await axios.get(this.credentialUrl);
        response = response.data;
        if (!response) throw new Error('Can not accept credential');
        if (response && response.status != 200) throw new Error(response.error);
        if (!response.message) throw new Error('Can not accept credential');
        this.loading =false;
        return response.message
    },

    async acceptCredential(credential){
      //console.log('acceptCredential...')
          if(this.hypersign.did != credential.credentialSubject.id) throw new Error('This credential is not being issued to you');
          const confirmed = await this.$store.dispatch('modals/open', {
                    name: 'confirm',
                    title: 'Credential Acceptance',
                    msg: `You are receiving credential: '${credential.type[1]}' \
                    from an issuer: '${credential.issuer}'. \
                    Do you want to accept?`,
                  })
                  .catch(() => false);
        if(confirmed){
          this.$store.commit('addHSVerifiableCredential', credential);
        }
    },

    async credentialsQRData(data){
      try {
        //console.log('credentialsQRData method....')
        //console.log(data);
        this.credentialUrl = data;
        let cred = await this.fetchCredential();
        this.$store.commit('addHSVerifiableCredentialTemp', cred);
        this.$router.push(`/credential/temp/${cred.id}`);
      } catch (e) {
        this.loading = false;
        if (e.message) this.$store.dispatch('modals/open', { name: 'default', msg:e.message });
      }
    },

    async credentialDetailsQRdata(qrData){
      try{
        //console.log(qrData)
        
        //console.log('credentialDetailsQRdata method....')
        if(qrData == {}) throw new Error('Parsed QR data is empty');

          const { serviceEndpoint, appDid, appName, schemaId } = qrData;
          
          if(!schemaId) throw new Error('Invalid schemaId');
          this.$store.commit('addRequestingAppName', appName);
          this.verifiableCredential = this.hypersign.credentials.find(x => {
            const credentialSchemaUrl = x['@context'][1].hsscheme;
            const credentialSchemaId = (credentialSchemaUrl.split('get/')[1]).trim();
            if(x.issuer === appDid && credentialSchemaId === schemaId) return x
          });

          if(!this.verifiableCredential) throw new Error('Credential not found');
          this.$router.push(`/credential/authorize/${this.verifiableCredential.id}`);

          /**
           * From here it needs to be added in authorize page 
           */
          // const credentialSchemaUrl = this.verifiableCredential['@context'][1].hsscheme;
          // const credentialSchemaId = (credentialSchemaUrl.split('get/')[1]).trim();

          // if(schemaId != credentialSchemaId) throw new Error('Invalid credential request');

          // const credentialName = this.verifiableCredential.type[1];

          // // TODO: 
          // const confirmed = await this.$store.dispatch('modals/open', {
          //   name: 'confirm',
          //   title: 'Credential Request',
          //   msg: `Application: '${appName}' \
          //   is requesting credential: '${credentialName}'. \
          //   Do you want to allow?`,
          // })
          // .catch(() => false);

          // if(confirmed){
          //     const url = Url(serviceEndpoint, true);
          //     const challenge = url.query.challenge;
          //     this.loading= true;
          //     const verifyUrl = url.origin + url.pathname;
          //     const vp_unsigned = await hypersignSDK.credential.generatePresentation(
          //       this.verifiableCredential,
          //       this.hypersign.did,
          //     );
          //     //console.log('Unsigned vp created..');
          //     const vp_signed = await hypersignSDK.credential.signPresentation(
          //       vp_unsigned,
          //       this.hypersign.did,
          //       this.hypersign.keys.privateKeyBase58,
          //       challenge,
          //     );
          //     //console.log('Signed vp created..');
          //     const body = {
          //       challenge,
          //       vp: JSON.stringify(vp_signed),
          //     };
          //     let response = await axios.post(verifyUrl, body);
          //     response = response.data;
          //     if (!response) throw new Error('Could not verify the presentation');
          //     if (response && response.status != 200) throw new Error(response.error);
          //     if (response.message)
          //       this.$store.dispatch('modals/open', {
          //         name: 'default',
          //         msg: 'Credential successfully verified',
          //     });
          //     this.loading = false;
          // }

        }catch (e) {
        this.loading = false;
        if (e.message) this.$store.dispatch('modals/open', { name: 'default', msg:e.message });
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
  }
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

.scan-text{
  margin-left: 10px;
  margin-bottom: 2px;
  // float: right;
}

.scanner {
  position: fixed;
  bottom:15px;
  width: 50%;
  border-radius: 49px;
  
}
</style>
