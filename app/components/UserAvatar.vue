<template lang="pug">
  span.userAvatar
    span(v-tooltip="`Unieke ID: ${id.substring(id.length - 6)}`")
      Avatar.avatar(:name="id" variant="marble" :colors='colors' :size="20")
      span.name {{ userName }}
    span.admin(v-if="isAdmin")
      v-icon(:icon="mdiCheckDecagram" v-tooltip="'tijdloze.rocks admin'" size="16")
</template>

<script setup>
import Avatar from 'vue-boring-avatars'
import { mdiCheckDecagram } from "@mdi/js";

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false
  }
})

const colors = ["#336699","#33aabb","#44ddee","#aaeeff","#ffeeaa","#ffcc33","#ff9944","#ff6655","#ee5566","#dd4477"]

</script>

<style scoped lang="scss">
span.userAvatar {
  * {
    vertical-align: middle;
  }
  span.name {
    margin-left: 6px;
    font-weight: bold;
  }
  span.admin {
    color: #7766ff;
    margin-left: 4px;
  }
}

</style>