<template>
    <div class="popup">
      <span class="altText" v-if="hypersign.credentials.length == 0">No credential found. Scan QR to get credentials.</span>
      <Panel v-else>
        <PanelItem
          v-for="credential in hypersign.credentials"
          :key="credential.id"
          :to="`/credential/${credential.id}`"
          :title="credential.type[1]"
          :info="credential.issuanceDate"
        />
      </Panel>
      <Loader v-if="loading" />

      <div class="">
        <!-- <button class="scan" data-cy="scan-button" @click="scan">
          <QrIcon width="20" height="20" /><span class="scan-text">{{ $t('pages.credential.scan') }}</span>
        </button> -->
        <Button @click="scan" class="scan scanner scan-text"  data-cy="scan-button">
          {{ $t('pages.credential.scan') }}
        </Button>
      </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import QrIcon from '../../../icons/qr-code.svg?vue-component';
import removeAccountMixin from '../../../mixins/removeAccount';
import CheckBox from '../components/CheckBox';
import Panel from '../components/Panel';
import PanelItem from '../components/PanelItem';
import Textarea from '../components/Textarea';
import Button from '../components/Button';

import axios from 'axios';
import { contractCallStatic } from '../../../lib/background-utils';

export default {
  mixins: [removeAccountMixin],
  components: { CheckBox, Panel,Button, PanelItem, QrIcon, Textarea },
  data() {
    return {
      form: {
        url: '',
        amount: '',
      },
      loading: false
    };
  },
  props: ['address'],
  computed: {
    ...mapState(['saveErrorLog']),
    ...mapGetters(['hypersign']),
    validUrl() {
      return this.form.url != '';
    },
  },
  created() {

    //Only for deeplinking
    if(this.$route.query.url && this.$route.query.url !='')
      this.deeplink(this.$route.query.url)
  },
  methods: {
    async scan() {
      try {
        this.form.url = await this.$store.dispatch('modals/open', {
          name: 'read-qr-code',
          title: this.$t('pages.credential.scanCredential'),
        });
        this.loading = true;
        let response = await axios.get(this.form.url);
        response = response.data;
        if (!response) throw new Error('Could not register for hsauth credential');
        if (response && response.status != 200) throw new Error(response.error);
        if (response.message) this.$store.commit('addHSVerifiableCredential', response.message);
        this.loading = false;
      } catch (e) {
        this.loading = false;
        if (e.message) this.$store.dispatch('modals/open', { name: 'default', msg:e.message });
      }
    },
    async deeplink(url) {
      try {
        this.form.url = url
        this.loading = true;
        let response = await axios.get(this.form.url);
        response = response.data;
        if (!response) throw new Error('Could not register for hsauth credential');
        if (response && response.status != 200) throw new Error(response.error);
        if (response.message) this.$store.commit('addHSVerifiableCredential', response.message);
        this.loading = false;
      } catch (e) {
        this.loading = false;
        if (e.message) this.$store.dispatch('modals/open', { name: 'default', msg:e.message });
      }
    }

  },
};
</script>


<style lang="scss" scoped>
@import '../../../common/variables';
.altText{
  color: #80808091;
  font-size: larger;
}
.d-flex {
  display: flex;
  float: right;
  padding: 5px;
}

.credential-list {
    min-height: 700px;
overflow-y: auto;
border-radius: 5px;
overflow-x: hidden;
max-height: 700px;
    
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
