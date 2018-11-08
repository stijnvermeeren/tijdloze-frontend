<template>
    <span>
        <span v-if="song.notInList(year, true)">-</span>
        <span v-else-if="song.position(year, true)">{{song.position(year, true)}}</span>
        <span v-else>?</span>
    </span>
</template>

<script>
  export default {
    props: ["song", "year"]
  }
</script>
