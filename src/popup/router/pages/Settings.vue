<template>
  <div class="popup">
    <Panel>
      <!-- <PanelItem
        to="/generalSettings"
        :title="$t('pages.settings.tabGeneral')"
        :info="$t('pages.settings.tabGeneralsmall')"
      /> -->

       <PanelItem
        to="/credential"
        :title="$t('pages.settings.credentials')"
        :info="$t('pages.settings.credentialsSmall')"
      />
    

    <PanelItem
        to="/backupWallet"
        :title="$t('pages.settings.backupWallet')"
        :info="$t('pages.settings.backupWalletSmall')"
      />

        
      <PanelItem
        @click="removeAccount"
        :title="$t('pages.settings.tabRemoveAccount')"
        :info="$t('pages.settings.tabRemoveAccountSmall')"
      />

      

     

      <!-- <PanelItem
        :title="$t('pages.settings.tabSaveErrorLog')"
        :info="$t('pages.settings.tabSaveErrorLogSmall')"
      >
        <CheckBox
          slot="content"
          :value="saveErrorLog"
          name="saveErrorLog"
          type="checkbox"
          @input="val => $store.commit('setSaveErrorLog', val)"
        />
      </PanelItem> -->
    </Panel>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import removeAccountMixin from '../../../mixins/removeAccount';
import CheckBox from '../components/CheckBox';
import Panel from '../components/Panel';
import PanelItem from '../components/PanelItem';

export default {
  mixins: [removeAccountMixin],
  components: { CheckBox, Panel, PanelItem },
  computed: mapState(['saveErrorLog']),
};
</script>
