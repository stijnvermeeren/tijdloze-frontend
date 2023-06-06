<template lang="pug">
div.container
  el-radio-group(v-model='liveValue' size="small")
    el-radio-button(
      v-for='[genderId, genderName] in Object.entries(vocalsGenders)'
      :key='genderId'
      :label="genderId"
    ) {{genderName}}
  el-button(icon="el-icon-circle-close" @click="liveValue = undefined" circle size="small")
</template>

<script>
  import vocalsGenders from '~/utils/leadVocals'

  export default {
    props: {
      modelValue: String
    },
    emits: ['update:modelValue'],
    data() {
      return {
        liveValue: this.modelValue
      }
    },
    computed: {
      vocalsGenders() {
        return vocalsGenders;
      }
    },
    watch: {
      modelValue(newValue) {
        this.liveValue = newValue
      },
      liveValue(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.$emit('update:modelValue', newValue);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
div.container > div {
  vertical-align: middle;
}

.el-radio-group {
  margin-right: 10px;
}
</style>
