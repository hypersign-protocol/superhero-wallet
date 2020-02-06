<template>
    <div class="text-left">
        <label class="label" v-if="label">{{ label }}</label>
        <input
            type="text"
            class="input"
            :placeholder="placeholder ? placeholder : ''"
            :class="getClasses"
            :value="value" @input="$emit('input', $event.target.value)" />
    </div>
    
</template>

<script>
export default {
    props:['value','error','placeholder','size','type','label'],
    data(){
        return { err: false }
    },
    watch: {
        value(val) {
            if(this.type == 'number' && isNaN(val)) {
                this.err = true 
            } else {
                this.err = false
            }
        }
    },
    computed: {
        getClasses() {
            let cl = [];
            if(this.error || this.err) {
                cl.push("has-error")
            }
            if(this.size == "sm") {
                cl.push("input-sm")
            }

            return cl.join(" ");
        }
    }
}
</script>

<style lang="scss">
@import '../../../common/variables';

input.input {
    display: block;
    width:100%;
    border-radius: 5px;
    border:2px solid $border-color !important;
    background: $input-bg-color !important;
    padding:10px;
    margin-bottom:22px;
    color: $text-color !important;
    font-size: 14px;
    min-height: 35px;
    margin-left:auto;
    margin-right: auto;
}
.input:focus {
    border-color: $accent-color !important;
}
.input.has-error {
    border-color: $secondary-color !important;
}
.input.input-sm{
    font-size:14px;
}
.label {
    font-size:14px;
    margin: 4px 0;
    display:block;
    font-weight: normal;
}
</style>