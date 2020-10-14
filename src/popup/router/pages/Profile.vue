<template>
  <div class="claim-tips popup">
    <!-- <p class="primary-title text-left mb-8 f-16">
      {{ $t('pages.claimTips.urlToClaim') }}
    </p>
    <Input size="m-0 sm" v-model="url" :error="!normalizedUrl" /> -->

    <p class="primary-title text-left mb-8 f-16">
      DID
    </p>
    <div class="ae-address">{{ hypersign.did }}</div>

    <p class="primary-title text-left mb-8 f-16">
      Name
    </p>
    <Input size="m-0 sm" v-model="name" />

    <p class="primary-title text-left mb-8 f-16">
      Email
    </p>
    <Input size="m-0 sm" v-model="email" />

    <!-- <Button @click="claimTips" :disabled="!normalizedUrl || !allowTipping"> 
      {{ $t('pages.tipPage.confirm') }}
    </Button>-->
    
    <Button @click="setupProfile">
      {{ $t('pages.tipPage.confirm') }}
    </Button>
    
    <Button :to="{ name: 'account' }">
      {{ $t('pages.tipPage.cancel') }}
    </Button>

    <Loader v-if="loading" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import axios from 'axios';
import { aettosToAe, toURL, validateTipUrl } from '../../utils/helper';
import { TIP_SERVICE, BACKEND_URL } from '../../utils/constants';
import Input from '../components/Input';
import { catchError } from 'rxjs/operators';

export default {
  components: { Input },
  data: () => ({
    url: '',
    loading: false,
    email: "",
    name: "",
  }),
  computed: {
    ...mapState(['sdk', 'tipping']),
    ...mapGetters(['account', 'allowTipping', 'hypersign']),
    normalizedUrl() {
      if (!validateTipUrl(this.url)) return '';
      return toURL(this.url).toString();
    },
  },
  async created() {
    if (process.env.IS_EXTENSION) {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      if (tab && validateTipUrl(tab.url)) {
        this.url = tab.url;
      }
    }
  },
  methods: {
    async setupProfile(){
      try{
        //// HS_TODO::
        // Fetch email, name from text box
        // Fetch did from localstore
        // Call studio register api to get a hypersign credentials
        // Once you get the credential, store it in the localstore. - this we need to think a bit, how will user store it, either in browser storage or how
        const HS_STUDIO_REGISTER_URL = "http://192.168.43.43:9000/api/auth/register"
        const body = {
          fname	: this.name,
          email	: this.email,  
          publicKey: this.hypersign.did
        }
        console.log(body)
        await axios.post(HS_STUDIO_REGISTER_URL, body)
        .then(res => {
          res = res.data;
          if(!res) throw new Error("Could not register for hsauth credential");
          if(res && res.status != 200) throw new Error(res.error);          
          if (res.message) this.$store.dispatch('modals/open', { name: 'default', msg: 'An email has been sent to you. Please scan the QR code to download the HypersignAuth credentials' });
        })
        .catch(e => {
          if (e.message) this.$store.dispatch('modals/open', { name: 'default', msg:e.message });
        })
      }catch(e){
        if (e.message) this.$store.dispatch('modals/open', { name: 'default', msg:e.message });
      }
    },
    async claimTips() {
      const url = this.normalizedUrl;
      this.loading = true;
      await this.$watchUntilTruly(() => this.sdk && this.tipping);
      try {
        const claimAmount = parseFloat(
          aettosToAe(
            await this.tipping.methods
              .unclaimed_for_url(url)
              .then(r => r.decodedResult)
              .catch(() => 1),
          ),
        );
        if (!claimAmount) throw new Error('NO_ZERO_AMOUNT_PAYOUT');
        await axios.post(TIP_SERVICE, { url, address: this.account.publicKey });
        await axios.get(`${BACKEND_URL}/cache/invalidate/tips`).catch(console.error);
        await axios.get(`${BACKEND_URL}/cache/invalidate/oracle`).catch(console.error);
        this.$store.dispatch('modals/open', { name: 'claim-success', url, claimAmount });
        this.$router.push({ name: 'account' });
      } catch (e) {
        const { error = '' } = e.response ? e.response.data : {};
        let msg;
        if (error.includes('MORE_ORACLES_NEEDED')) msg = this.$t('pages.claim.moreOracles');
        else if (error.includes('URL_NOT_EXISTING')) msg = this.$t('pages.claim.urlNotExisting');
        else if (
          error.includes('NO_ZERO_AMOUNT_PAYOUT') ||
          e.message.includes('NO_ZERO_AMOUNT_PAYOUT')
        )
          msg = this.$t('pages.claim.noZeroClaim');
        else if (error.includes('ORACLE_SEVICE_CHECK_CLAIM_FAILED'))
          msg = this.$t('pages.claim.oracleFailed');
        else if (error) msg = error;
        if (msg) this.$store.dispatch('modals/open', { name: 'default', msg });
        else {
          e.payload = { url };
          throw e;
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.claim-tips .input-wrapper {
  margin: 20px 0;
}

.ae-address {
    color: lightgray;
    font-size: 20px;
    letter-spacing: -0.2px;
  }
</style>
