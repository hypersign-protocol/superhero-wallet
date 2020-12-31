<template>
  <div class="popup">
    <div class="mt-10"> 
      
      <Input
        label="DID"
        :value="profile.did"
        disabled
       />
      <Input
        placeholder="Enter name"
        label="Name"
        v-model="profile.name"
        :disabled="ifAllDisabled"
      />
      <Input
        placeholder="Enter email id"
        label="Email Id"
        v-model="profile.email"
        :disabled="ifAllDisabled"
      />
      
      <Button half :to="{ name: 'account' }">
        {{ $t('pages.tipPage.cancel') }}
      </Button>

      <Button half @click="setupProfile"
      :disabled="!profile.name || !profile.did ||  !profile.email"
      v-if ="ifCreate"
      >
        {{ $t('pages.tipPage.confirm') }}
      </Button>

      <Button half @click="edit" v-if="ifEdit" >
        Edit
      </Button>
      
      <Loader v-if="loading" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import axios from 'axios';
import { aettosToAe, toURL, validateTipUrl } from '../../utils/helper';
import { TIP_SERVICE, BACKEND_URL } from '../../utils/constants';
import Input from '../components/Input';
import { catchError } from 'rxjs/operators';
import { SUPERHERO_HS_AUTH_BASE_URL, SUPERHERO_HS_AUTH_CREDENTIAL_ISSUE_API} from '../../utils/hsConstants'

export default {
  components: { Input },
  data: () => ({
    url: '',
    loading: false,
    ifEdit: false,
    ifCreate: true,
    ifAllDisabled: false,
    profile: {
      email: "",
      name: "",
      did: ""
    },
    copied: false,
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
    if(Object.keys(this.hypersign.profile).length == 0)
    {
      this.profile.did  = this.hypersign.did
      
    }else{
      this.profile = { ...this.hypersign.profile }
      this.ifEdit = true;
      this.ifCreate = false;
      this.ifAllDisabled = true;
    }
  },
  methods: {
    edit() {
      this.ifAllDisabled = false;
      this.ifEdit = false;
      this.ifCreate = true;
    },
    setupProfile(){
      try{
        this.loading = true;
        //// HS_TODO::
        // Fetch email, name from text box
        // Fetch did from localstore
        // Call studio register api to get a hypersign credentials
        // Once you get the credential, store it in the localstore. - this we need to think a bit, how will user store it, either in browser storage or how
        const HS_STUDIO_REGISTER_URL = `${SUPERHERO_HS_AUTH_BASE_URL}${SUPERHERO_HS_AUTH_CREDENTIAL_ISSUE_API}`
        
        const body = {
          fname	: this.profile.name,
          email	: this.profile.email,  
          publicKey: this.profile.did
        }

        console.log(body)
        axios.post(HS_STUDIO_REGISTER_URL, body)
        .then(res => {
          res = res.data;
          if(!res) throw new Error("Could not register for hsauth credential");
          if(res && res.status != 200) throw new Error(res.error);          
          const msg = `
              An email with a QR code has been sent to the address you provided. \
              Scan the code with your Hypersign Wallet to get the credential. \
              You can use this credential to authenticate yourself in any website which \
              supports Hypersign login.
          `
          this.loading = false;
          if (res.message) this.$store.dispatch('modals/open', { name: 'default', msg });
          this.$store.commit('addHSProfile', this.profile);
          this.ifEdit = true;
          this.ifCreate = false;
          this.ifAllDisabled = true;
        })
        .catch(e => {
          this.loading = false;
          if (e.message) this.$store.dispatch('modals/open', { name: 'default', msg:e.message });
        })
      }catch(e){
        this.loading = false;
        if (e.message) this.$store.dispatch('modals/open', { name: 'default', msg:e.message });
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
