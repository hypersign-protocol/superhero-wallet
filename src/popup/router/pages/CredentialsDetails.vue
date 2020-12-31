<template>
  <div class="popup">
    <div class="">
      <div class="cred-card">
        <div class="cred-card-header">
          <span>{{ verifiableCredential.type[1] }}</span>
        </div>
        <div class="cred-card-body">
          <span class="cred-card-body-detail">{{ verifiableCredential.issuer }}</span
          ><br />
          <span class="cred-card-body-detail">Issued: {{ verifiableCredential.issuanceDate }}</span
          ><br />
          <span class="cred-card-body-detail">Expires: {{ verifiableCredential.issuanceDate }}</span
          ><br />
        </div>
      </div>
      <ul class="list-group">
        <li class="list-group-item" v-for="claim in claims" :key="claim">
          <div class="list-title">{{ claim }}: </div>
          <div>{{ verifiableCredential.credentialSubject[claim] }}</div>
        </li>
      </ul>
      <Loader v-if="loading" />
      <div class="">
        <Button @click="scan" class="scan scanner scan-text"  data-cy="scan-button">
          {{ $t('pages.credential.scan') }}
        </Button>
      </div>
    </div>
    <!-- <div class="scanner d-flex">
      <div class="scan" data-cy="scan-button" @click="scan">
        <QrIcon width="20" height="20" /><span class="scan-text">{{ $t('pages.credential.scan') }}</span>
      </div>
    </div> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import QrIcon from '../../../icons/qr-code.svg?vue-component';
import Url from 'url-parse';
import axios from 'axios';
import { hypersignSDK } from '../../utils/hypersign';
export default {
  components: { QrIcon },
  data() {
    return {
      verifiableCredential: {},
      claims: [],
      loading: false
    };
  },
  created() {
    const credentialId = this.$route.params.credentialId;
    if (credentialId) {
      this.verifiableCredential = this.hypersign.credentials.find(x => x.id == credentialId);
      this.claims = Object.keys(this.verifiableCredential.credentialSubject);
    }
  },
  computed: {
    ...mapGetters(['hypersign']),
  },
  methods: {
    async scan() {
      try {
        const qrData = await this.$store.dispatch('modals/open', {
          name: 'read-qr-code',
          title: this.$t('pages.credential.scanToPresent'),
        });
        const url = Url(qrData, true);
        const challenge = url.query.challenge;

        // const credentialSchema = url.query.schemaId;
        // HS_TODO: verfiy the schema
        this.loading= true;
        const verifyUrl = url.origin + url.pathname;
        const vp_unsigned = await hypersignSDK.credential.generatePresentation(
          this.verifiableCredential,
          this.hypersign.did,
        );
        console.log('Unsigned vp created..');
        const vp_signed = await hypersignSDK.credential.signPresentation(
          vp_unsigned,
          this.hypersign.did,
          this.hypersign.keys.privateKeyBase58,
          challenge,
        );
        console.log('Signed vp created..');
        const body = {
          challenge,
          vp: JSON.stringify(vp_signed),
        };
        let response = await axios.post(verifyUrl, body);
        response = response.data;
        if (!response) throw new Error('Could not verify the presentation');
        if (response && response.status != 200) throw new Error(response.error);
        if (response.message)
          this.$store.dispatch('modals/open', {
            name: 'default',
            msg: 'Credential successfully verified',
          });
        this.loading=false;
      } catch (e) {
        this.loading=false;
        if (e.message) this.$store.dispatch('modals/open', { name: 'default', msg: e.message });
      }
    },
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
.scan-text{
  margin-left: 20px;
  float: right;
}
.scanner {
  position: fixed;
  bottom: 0;
  margin-top: 3%;
  width: 59%;
  border-radius: 49px;
  margin-left: 13%;
}
.credential-list {
    min-height: 700px;
overflow-y: auto;
border-radius: 5px;
overflow-x: hidden;
max-height: 700px;
    
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