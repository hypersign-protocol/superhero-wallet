<template>
  <div class="popup">
      <p>
        //// HS_TODO:: <br/>
        // Credentials list page <br/>
        // Show all credentials <br/>
        // Scan a credential <br/>
      </p>
      <div class="scan" data-cy="scan-button" @click="scan">
        <QrIcon />
      <small>{{ $t('pages.credential.scan') }}</small>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import QrIcon from '../../../icons/qr-code.svg?vue-component';
import removeAccountMixin from '../../../mixins/removeAccount';
import CheckBox from '../components/CheckBox';
import Panel from '../components/Panel';
import PanelItem from '../components/PanelItem';

export default {
  mixins: [removeAccountMixin],
  components: { CheckBox, Panel, PanelItem, QrIcon },
  computed: mapState(['saveErrorLog']),
  methods: {
    async scan() {
      this.form.address = await this.$store.dispatch('modals/open', {
        name: 'read-qr-code',
        title: this.$t('pages.credential.scanCredential'),
      });
    }
  }
};
</script>


<style lang="scss" scoped>
@import '../../../common/variables';

.d-flex {
  display: flex;
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
