<template>
    <span>
        <span v-if="song.notInList(year)">-</span>
        <span v-else-if="song.position(year)">{{song.position(year)}}</span>
        <span v-else>?</span>
    </span>
</template>

<script>
  export default {
    props: ["song", "year"]
  }
</script>
