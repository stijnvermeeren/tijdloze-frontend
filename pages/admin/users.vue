<template lang="pug">
  div
    h2 Gebruikers
    div
      div {{userCount}} gebruikers ({{adminCount}} admins, {{blockedCount}} geblokkeerd, {{activeCount}} actief in de laatste 24 uren).
      div
        button(@click='refresh()', :disabled='refreshing') Opnieuw laden
    h3 Lijst
    div
      | Sorteren op:
      input#sort-displayName(type='radio', v-model='sortProperty', value='displayName')
      label(for='sort-displayName') Gebruikersnaam
      input#sort-lastSeen(type='radio', v-model='sortProperty', value='lastSeen')
      label(for='sort-lastSeen') Laatste login
      input#sort-created(type='radio', v-model='sortProperty', value='created')
      label(for='sort-created') Laatst geregistreerd
    ul
      li(v-for='user in usersSorted')
        .displayName(v-if='user.displayName') {{user.displayName}}
        .anonymous(v-else) Geen gebruikernaam
        .admin(v-if='user.isAdmin') Admin
        .details
          div(v-if='user.id !== currentUser.id')
            .blocked(v-if='user.isBlocked')
              | Geblokkeerd -
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

  export default {
    name: 'users',
    data() {
      return {
        refreshing: false,
        sortProperty: 'lastSeen'
      }
    },
    computed: {
      currentUser() {
        return this.$store.state.auth.user;
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
          parseInt(dateString.substr(6, 4)),
          parseInt(dateString.substr(3, 2)) - 1,
          parseInt(dateString.substr(0, 2)),
          parseInt(dateString.substr(11, 2)),
          parseInt(dateString.substr(14, 2)),
          parseInt(dateString.substr(17, 2))
        )
      },
      async block(userId) {
        this.refreshing = true;
        await this.$axios.$post(`/user/${userId}/block`);
        this.users = await this.$axios.$get(`user/list`);
        this.refreshing = false;
      },
      async unblock(userId) {
        this.refreshing = true;
        await this.$axios.$delete(`/user/${userId}/block`);
        this.users = await this.$axios.$get(`user/list`);
        this.refreshing = false;
      },
      async refresh() {
        this.refreshing = true;
        this.users = await this.$axios.$get(`user/list`);
        this.refreshing = false;
      }
    },
    async asyncData({ params, app }) {
      return {
        users: await app.$axios.$get(`user/list`)
      };
    },
    middleware: 'admin',
    head: {
      title: 'Admin: Gebruikers'
    }
  }
</script>

<style lang="less" scoped>
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
