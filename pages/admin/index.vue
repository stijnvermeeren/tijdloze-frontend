<template>
  <div>
    <h2>Admin</h2>
    <ul>
      <li><nuxt-link to="/admin/live">Live updates</nuxt-link></li>
    </ul>
  </div>
</template>

<script>
  export default {
    middleware: 'admin'
  }
</script>

<style scoped>

</style>
