<template>
  <div class="popup">
    <div>
      <Panel>
        <PanelItem
          v-for="credential in hypersign.credentials"
          :key="credential.id"
          :to="`/credential/${credential.id}`"
          :title="credential.type[1]"
          :info="credential.issuanceDate"
        />
      </Panel>
    </div>
    
    <div class="d-flex">
      <div class="scan" data-cy="scan-button" @click="scan">
        <QrIcon width="30" height="30" /><br/><small>{{ $t('pages.credential.scan') }}</small>
      </div>
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
import axios from 'axios';
import { contractCallStatic } from '../../../lib/background-utils';

export default {
  mixins: [removeAccountMixin],
  components: { CheckBox, Panel, PanelItem, QrIcon, Textarea },
  data() {
    return {
      form: {
        url: '',
        amount: '',
      }
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
  methods: {
    async scan() {
      try {
        this.form.url = await this.$store.dispatch('modals/open', {
          name: 'read-qr-code',
          title: this.$t('pages.credential.scanCredential'),
        });
        let response = await axios.get(this.form.url);
        response = response.data;
        if (!response) throw new Error('Could not register for hsauth credential');
        if (response && response.status != 200) throw new Error(response.error);
        if (response.message) this.$store.commit('addHSVerifiableCredential', response.message);
      } catch (e) {
        if (e.message) this.$store.dispatch('modals/open', { name: 'default', msg:e.message });
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import '../../../common/variables';

.d-flex {
  display: flex;
  float: right;
  padding: 5px;
}

.d-flex:hover {
    background: #8080802b;
    padding: 5px;
    border-radius: 4px;
    box-shadow: 1px 1px #80808087;
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
