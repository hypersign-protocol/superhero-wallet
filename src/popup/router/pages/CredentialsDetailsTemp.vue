<template>
  <div class="popup">
    <div class="">
      <div class="cred-card">
        <div class="cred-card-header">
          <span>{{ credDetials.formattedSchemaName }}</span>
        </div>
        <div class="cred-card-body">
          <!-- <span class="cred-card-body-detail">Issuer Did:</span><br /> -->
          <span class="cred-card-body-detail">Issuer: {{ credDetials.formattedIssuer }}</span
          ><br />
          <!-- <span class="cred-card-body-detail">Issance Date:</span><br /> -->
          <span class="cred-card-body-detail">Issuance Date: {{ credDetials.formattedIssuanceDate }}</span
          ><br />
          
          <span class="cred-card-body-detail">Expiration Date: {{ credDetials.formattedExpirationDate }}</span
          ><br />
        </div>
      </div>
      <ul class="list-group credential-item">
        <li class="list-group-item" v-for="claim in claims" :key="claim">
          <div class="list-title">{{ claim }}: </div>
          <div>{{ verifiableCredential.credentialSubject[claim] }}</div>
        </li>
      </ul>
      <Loader v-if="loading" />
      
    </div>
    <div class="scanner d-flex">
      <Button class="scan"  data-cy="scan-button" @click="acceptCredential">
        <VerifiedIcon width="20" height="20" class="scan-icon"/><span class="scan-text">{{ $t('pages.credential.accept') }}</span>
      </Button>
    </div>
    <div class="scanner d-flex">
      <Button class="scan"  data-cy="scan-button" @click="rejectCredential">
        <CloseIcon width="20" height="20" class="scan-icon"/><span class="scan-text">{{ $t('pages.credential.reject') }}</span>
      </Button>
    </div>
   
    
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import QrIcon from '../../../icons/qr-code.svg?vue-component';
import VerifiedIcon from '../../../icons/badges/verified.svg?vue-component';
import CloseIcon from '../../../icons/badges/not-verified.svg?vue-component';
import Url from 'url-parse';
import axios from 'axios';
import { hypersignSDK } from '../../utils/hypersign';
import {toFormattedDate, toStringShorner} from '../../utils/helper'
export default {
  components: { QrIcon,CloseIcon,VerifiedIcon },
  data() {
    return {
      verifiableCredential: {},
      claims: [],
      loading: false,
      credDetials: {
        formattedIssuer: "",
        formattedExpirationDate: "",
        formattedIssuanceDate: "",
        formattedSchemaName: ""
      }
    };
  },
  created() {
    const credentialId = this.$route.params.credentialId;
    if (credentialId) {
      this.verifiableCredential = this.hypersign.credentialsTemp.find(x => x.id == credentialId);
      this.credDetials.formattedExpirationDate = toFormattedDate(this.verifiableCredential.expirationDate) ;
      this.credDetials.formattedIssuanceDate = toFormattedDate(this.verifiableCredential.issuanceDate) ;
      this.credDetials.formattedIssuer =  toStringShorner(this.verifiableCredential.issuer, 32, 15);
      this.credDetials.formattedSchemaName =  this.verifiableCredential.type[1]; //toStringShorner(this.verifiableCredential.type[1], 26, 15);
      this.claims = Object.keys(this.verifiableCredential.credentialSubject);
    }
  },
  computed: {
    ...mapGetters(['hypersign']),
  },
  methods: {    
    async acceptCredential(){
      let cred = this.verifiableCredential
      this.$store.commit('addHSVerifiableCredential', cred);
      this.$store.commit('clearHSVerifiableCredentialTemp', []);
      this.$router.push(`/account`);
    },
    async rejectCredential(){
      this.$store.commit('clearHSVerifiableCredentialTemp', []);
      this.$router.push(`/account`);
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../../../common/variables';
.cred-card-body {
  padding-left: 10px;
  margin-top: 27%;
  padding-bottom: 5%;
}
.scan-icon {
  margin:10px;
}
.scan-text{
  margin-left: 20px;
  margin-bottom: 2px;
  // float: right;
}
.scan { 
  border-radius: 49px;
  text-align: center;
}
.scanner {
  bottom:15px;
  width: 50%;
  border-radius: 49px;
}
.cred-card {
  background: #21222a !important;
  box-shadow: 0 0 8px rgba(0, 33, 87, 0.15);
  border-radius: 14px;
  margin-top: 7%;
  text-align: left;
  font-size: small;
  color: gray;
  padding-top: 7%;
}
.cred-card-header {
  color: #fff;

  border-bottom: 1px solid #80808061;
  border-top: 1px solid gray;

  background-color: #808080f0;

  font-size: larger;
  text-align: right;
  padding-right: 8px;
}
// .list-title{
//     color: black;
//     font-weight: bolder;
// }
.list-title {
  color: $text-color;
  font-size: 12px;
  text-transform:capitalize;
}
// .list-group {
//     color: gray;
// font-size: small;
// text-align: left;
//         padding-left: 10%;
//     padding-top: 2%;
//     display: -ms-flexbox;
//     display: -webkit-box;
//     display: flex;
//     -ms-flex-direction: column;
//     -webkit-box-orient: vertical;
//     -webkit-box-direction: normal;
//     flex-direction: column;
//     padding-left: 0;
//     margin-bottom: 0;
//     border-radius: .25rem;
// }
.list-group {
  padding: 0 !important;
  // background: #21222a !important;
  // box-shadow: 0 0 8px rgba(0, 33, 87, 0.15);
  // border-radius: 4px;
  margin-top: 30px;
}
.list-group-item {
  text-decoration: none;
  transition: 0.4s;
  position: relative;
  padding: 1rem 1.5rem;
  width: 100%;
  display: block;
  font-size: 12px;
  border-bottom: 1px solid #cccccc2e;
  text-align: left;
  border-left: 2px solid transparent;
  color: gray;
}
// .list-group-item {
//     position: relative;
//     display: block;
//     padding: .75rem 1.25rem;
//     background-color: #fff;
//     border: 1px solid rgba(0,0,0,.125);
//         border-top-width: 1px;
// }
.d-flex {
  display: flex;
  float: right;
  padding: 5px;
}
.withdraw.step1 {
  textarea {
    width: 250px;
    min-height: 60px !important;
    margin: 0 20px 0 0;
    font-size: 11px;
  }

  small {
    color: $accent-color;
    display: block;
    width: 100%;
    padding-top: 5px;
    font-size: 12px;
  }
}

.withdraw.step2 {
  p {
    display: flex;
    justify-content: center;
    line-height: 2rem;
  }

  p:not(:first-of-type) {
    color: $text-color;
  }

  p > svg {
    margin-right: 10px;
  }

  .info-group {
    text-align: left;
    display: block;
    margin: 20px 0;

    .info-label {
      display: block;
      padding: 10px 0;
    }

    .info-span {
      color: $accent-color;
      font-size: 11px;
      display: inline-block;
      width: 300px;
      white-space: nowrap;
      // overflow: hidden !important;
      // text-overflow: ellipsis;
      letter-spacing: -0.3px;
      cursor: pointer;
    }

    .amount {
      font-size: 26px;
      color: $secondary-color;
    }

    .currencyamount {
      font-size: 18px;
      display: block;

      span {
        font-size: 18px;
      }
    }
  }

  .text-center {
    text-align: center;
  }
}
</style>