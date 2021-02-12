<template>
  <div class="popup">
    <div data-cy="seed-phrase-backup-window" v-if="type == ''">
      <div class="maindiv_input-group-addon">
          <img src="../../../icons/cloud-download-down-arrow.svg" alt="Upload logo" class="icon" />
          <div class="margin-20">
            <label class="sett_info">{{ $t('pages.restore-wallet.select-info') }}</label>
          </div>
          <div class="margin-20">
            <ListItem v-for="network in options" :key="network.text" @click.native="selectNetwork(network)" class="network-row">
              <div class="margin-10">
                {{network.text}}
              </div>
              <div class="mr-auto text-left">
                <p class="f-16" data-cy="network-name">{{ network.name }}</p>
              </div>
              <CheckBox
                :value="network.value === activeNetwork"
                type="radio"
                :disabled="network.disabled"
                name="activeNetwork"
                prevent
              />
            </ListItem>
          </div>
         
        <Button >
          {{ $t('pages.restore-wallet.button') }}
        </Button>
      </div>
      <div v-if="loading" class="loading">
        <ae-loader />
      </div>
    </div>
  </div>
</template>

<script>
import ListItem from '../components/ListItem';
import CheckBox from '../components/CheckBox';

export default {
  components: {
    ListItem,
    CheckBox
  },
  data() {
    return {
      loading: false,
      activeNetwork:'',
      modal: {
        visible: false,
        title: '',
      },
      seedPhrase: '',
      options: [
        { 
          text: this.$t('pages.restore-wallet.select-option-1'), 
          value: "local",
          disabled:false,
        },
        { 
          text: this.$t('pages.restore-wallet.select-option-2'), 
          value: "cloud",
          disabled:true,
        }
      ],
      alert: {
        fill: 'neutral',
        show: false,
        content: '',
      },
      type: '',
      seeds: [
        { id: 0, name: 'volcano', selected: false },
        { id: 1, name: 'entire', selected: false },
        { id: 2, name: 'magnet', selected: false },
        { id: 3, name: 'glow', selected: false },
        { id: 4, name: 'zero', selected: false },
        { id: 5, name: 'crack', selected: false },
        { id: 6, name: 'arena', selected: false },
        { id: 7, name: 'episode', selected: false },
        { id: 8, name: 'shrimp', selected: false },
        { id: 9, name: 'buffalo', selected: false },
        { id: 10, name: 'tiny', selected: false },
        { id: 11, name: 'aunt', selected: false },
      ],
      selectedSeed: [],
      seedError: {},
      seed_verified: false,
    };
  },
  methods: {
    async selectNetwork(network) {
      if(!network.disabled){
        this.activeNetwork = network.value
      } else {
        alert('Feature coming soon ...')
        // await this.$store.dispatch('modals/open', {
        // name: 'default',
        // ...this.$t('modals.coming-soon'),
        // });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../../common/variables';
.margin-20 {
  margin-top:20px;
  margin-bottom:20px
}
.margin-10 {
  margin-top:10px;
  margin-bottom:10px
}
.icon {
  max-width:55%;
  margin-left: 23%;
  display:block;
  margin-top: 75px;
  width: 55%;
  filter: invert(51%) sepia(63%) saturate(10%) hue-rotate(37deg) brightness(88%) contrast(89%);
}
.heading {
  margin-top: 10px !important;
  margin-bottom: 10px !important;
}
.ae-modal {
  background: $border-color !important;
}

.mnemonics p,
.mnemonics button {
  color: #000 !important;
}

.regbtn {
  background: #ff0d6a;
  color: #fff;
  float: right;
  width: 19%;
  border-radius: 0 !important;
}

.maindiv_input-group-addon {
  color:#000 !important;
  padding-top:10px;
}

.maindiv_input-group-addon h4 {
  text-align: left;
  margin: 0 !important;
}

.input-group-addon {
  background: #ececec;
  border: 1px solid #ccc;
  width: 79%;
  height: 56px;
  float: left;
}

.addon-input {
  width: 75%;
  outline: none;
  color: #828282;
  padding: 0;
  height: 55px;
  text-indent: 5px;
  caret-color: #ff0d6a;
}

.addon-lbl {
  font-weight: 600;
  color: #828282;
}

input:active,
input:focus {
  border: none;
  outline: none;
}

.notround {
  border-radius: 0 !important;
}

small {
  word-break: break-word;
}

.seedBadge {
  user-select: unset;
  cursor: pointer;
  border: 2px solid #edf3f7;

  .seedClose {
    margin-left: 5px;
  }

  &.selected {
    opacity: 0.4;
    cursor: unset;
    background: transparent;
    border: 2px solid #c1c1c1;
    color: #fff;
  }
}
</style>
