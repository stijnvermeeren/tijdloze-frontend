<template lang="pug">
Title Admin: Gebruikers
div
  div.flexTitle
    h2 Gebruikers
    v-btn(@click='refresh()' :disabled='refreshing' size="small" rounded) Opnieuw laden
  p {{userCount}} gebruikers ({{adminCount}} admins, {{blockedCount}} geblokkeerd, {{activeCount}} actief in de laatste 24 uren).
  div
    v-text-field(
      v-model="searchQuery"
      density="compact"
      label="Zoeken"
      :prepend-inner-icon="mdiMagnify"
      flat
      hide-details
      single-line
      clearable
    )

  v-data-table(
    :items="users"
    :headers="tableHeaders"
    v-model:search="searchQuery"
    :filter-keys="['name', 'username', 'id']"
    density="compact"
  )
    template(v-slot:item.username="{ item: user }")
      .displayName(v-if='user.displayName') {{user.displayName}}
      .anonymous(v-else) Geen gebruikernaam
      .admin(v-if='user.isAdmin') Admin
    template(v-slot:item.block="{ item: user }")
      div(v-if='user.id !== currentUser.id')
        .blocked(v-if='user.isBlocked')
          div Geblokkeerd
          v-btn(@click='unblock(user.id)', :disabled='refreshing' density="compact" ) weer toelaten
        div(v-else)
          v-btn(@click='block(user.id)', :disabled='refreshing' density="compact") blokkeren
</template>

<script>
  import _ from 'lodash'
  import {useAuthStore} from "~/stores/auth";
  import {mdiMagnify} from "@mdi/js";
  import useFetchOptsDelete from "~/composables/useFetchOptsDelete";

  export default defineNuxtComponent({
    setup() {
      definePageMeta({
        middleware: 'admin'
      })
    },
    data() {
      return {
        refreshing: false,
        sortProperty: 'lastSeen',
        searchQuery: ''
      }
    },
    computed: {
      mdiMagnify() {
        return mdiMagnify
      },
      tableHeaders() {
        return [
          {
            title: 'Gebruikersnaam',
            key: 'username',
            value: 'displayName',
            headerProps: {style: 'font-weight: bold'}
          },
          {
            title: '',
            key: 'block'
          },
          {
            title: 'Naam',
            key: 'name',
            value: 'name',
            headerProps: { style: 'font-weight: bold'}
          },
          {
            title: 'ID',
            key: 'id',
            value: 'id',
            headerProps: { style: 'font-weight: bold'}
          },
          {
            title: 'Registratie',
            key: 'created',
            value: 'created',
            headerProps: { style: 'font-weight: bold'},
            sort: (a, b) => {
              return this.parseDate(a).getTime() - this.parseDate(b).getTime()
            }
          },
          {
            title: 'Laatste login',
            key: 'lastSeen',
            value: 'lastSeen',
            headerProps: { style: 'font-weight: bold'},
            sort: (a, b) => {
              return this.parseDate(a).getTime() - this.parseDate(b).getTime()
            }
          }
        ]
      },
      currentUser() {
        return useAuthStore().user;
      },
      userCount() {
        return this.users.length;
      },
      adminCount() {
        return this.users.filter(user => user.isAdmin).length;
      },
      blockedCount() {
        return this.users.filter(user => user.isBlocked).length;
      },
      activeCount() {
        return this.users.filter(user => {
          return this.parseDate(user.lastSeen) > new Date(Date.now() - 24 * 3600 * 1000)
        }).length;
      }
    },
    methods: {
      parseDate(dateString) {
        return new Date(
          parseInt(dateString.substring(6, 10)),
          parseInt(dateString.substring(3, 5)) - 1,
          parseInt(dateString.substring(0, 2)),
          parseInt(dateString.substring(11, 13)),
          parseInt(dateString.substring(14, 16)),
          parseInt(dateString.substring(17, 19))
        )
      },
      async block(userId) {
        this.refreshing = true;
        await this.$api(`/user/${userId}/block`, useFetchOptsPost());
        this.users = await this.$api(`user/list`);
        this.refreshing = false;
      },
      async unblock(userId) {
        this.refreshing = true;
        await this.$api(`/user/${userId}/block`, useFetchOptsDelete());
        this.users = await this.$api(`user/list`);
        this.refreshing = false;
      },
      async refresh() {
        this.refreshing = true;
        this.users = await this.$api(`user/list`);
        this.refreshing = false;
      }
    },
    async asyncData({$api}) {
      const users = await $api(`user/list`);
      return {users};
    }
  })
</script>

<style lang="scss" scoped>
  div.displayName {
    font-weight: bold;
  }
  div.anonymous {
    font-style: italic;
  }

  div.details {
    font-size: 12px;
  }

  div.admin {
    color: green;
    font-weight: bold;
  }

  div.blocked {
    color: red;
    font-weight: bold;
  }
</style>
