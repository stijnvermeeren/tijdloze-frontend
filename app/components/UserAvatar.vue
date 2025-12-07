<template lang="pug">
  span.userAvatar
    span(v-tooltip="`Unieke ID: ${id.substring(id.length - 6)}`")
      Avatar.avatar(:name="id" variant="sunset" :colors='["#fa2e59", "#ff703f", "#f7bc05", "#ecf6bb", "#76bcad"]' :size="20")
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