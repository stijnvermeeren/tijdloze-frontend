<template lang="pug">
Title Avatars test
h2 Avatars test
div(v-for='i in 100' :key='i')
  UserAvatar(:id='`user-${i}`' :user-name='`User ${i}`' :is-admin='i % 3 === 0')
</template>