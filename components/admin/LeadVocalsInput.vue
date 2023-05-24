<template lang="pug">
div.container
  el-radio-group(v-model='liveValue' size="small")
    el-radio-button(
      v-for='[genderId, genderName] in Object.entries(vocalsGenders)'
      :key='genderId'
      :label="genderId"
    ) {{genderName}}
  el-button(icon="el-icon-circle-close" @click="liveValue = undefined" circle)
</template>

<script>
  import vocalsGenders from '~/utils/leadVocals'

  export default {
    name: 'LeadVocalsInput',
    props: {
      value: String
    },
    data() {
      return {
        liveValue: this.value
      }
    },
    computed: {
      vocalsGenders() {
        return vocalsGenders;
      }
    },
    watch: {
      value(newValue) {
        this.liveValue = newValue
      },
      liveValue(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.$emit('input', newValue);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-radio-group {
    margin-right: 10px;
  }
</style>
