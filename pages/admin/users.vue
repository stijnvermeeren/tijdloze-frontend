<template lang="pug">
Title Admin: Gebruikers
div
  div.flexTitle
    h2 Gebruikers
    v-btn(@click='refresh()' :disabled='refreshing' size="small" rounded) Opnieuw laden
  p {{userCount}} gebruikers ({{adminCount}} admins, {{blockedCount}} geblokkeerd, {{activeCount}} actief in de laatste 24 uren).
  div
    v-radio-group(inline label="Sorteren op" v-model='sortProperty' hide-details)
      v-radio(value='displayName' label="Gebruikersnaam")
      v-radio(value='lastSeen' label="Laatste login")
      v-radio(value='created' label="Laatst geregistreerd")
  ul
    li(v-for='user in usersSorted')
      .displayName(v-if='user.displayName') {{user.displayName}}
      .anonymous(v-else) Geen gebruikernaam
      .admin(v-if='user.isAdmin') Admin
      .details
        div(v-if='user.id !== currentUser.id')
          .blocked(v-if='user.isBlocked')
            | Geblokkeerd -
            |
            button(@click='unblock(user.id)', :disabled='refreshing') weer toelaten
          div(v-else)
            button(@click='block(user.id)', :disabled='refreshing') blokkeren
        div Naam: #[strong {{user.name}}]
        div ID: {{user.id}}
        div Registratie: {{user.created}}
        div Laatste login: {{user.lastSeen}}
</template>

<script>
  import _ from 'lodash'
  import {useAuthStore} from "~/stores/auth";

  export default defineNuxtComponent({
    setup() {
      definePageMeta({
        middleware: 'admin'
      })
    },
    data() {
      return {
        refreshing: false,
        sortProperty: 'lastSeen'
      }
    },
    computed: {
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
          return this.parseDate(user.lastSeen) > new Date(Date.now() - 24*3600*1000)
        }).length;
      },
      usersSorted() {
        let sortFn = user => user.displayName;
        if (this.sortProperty === 'created') {
          sortFn = user => {
            return - this.parseDate(user.created).valueOf()
          }
        }
        if (this.sortProperty === 'lastSeen') {
          sortFn = user => {
            return - this.parseDate(user.lastSeen).valueOf()
          }
        }

        return _.sortBy(this.users, sortFn)
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
        await useApiFetchPost(`/user/${userId}/block`);
        const {data: usersData} = await useApiFetch(`user/list`);
        this.users = usersData
        this.refreshing = false;
      },
      async unblock(userId) {
        this.refreshing = true;
        await useApiFetchDelete(`/user/${userId}/block`);
        const {data: usersData} = await useApiFetch(`user/list`);
        this.users = usersData
        this.refreshing = false;
      },
      async refresh() {
        this.refreshing = true;
        const {data: usersData} = await useApiFetch(`user/list`);
        this.users = usersData
        this.refreshing = false;
      }
    },
    async asyncData() {
      const {data: users} = await useApiFetch(`user/list`);
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
