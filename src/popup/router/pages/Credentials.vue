<template>
  <div class="popup">
      <p>
        //// HS_TODO::
        // Credentials list page
        // Show all credentials
        // Scan a credential
      </p>
      <div class="scan" data-cy="scan-button" @click="scan">
              <QrIcon />
      <small>{{ $t('pages.send.scan') }}</small>
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
};
</script>
