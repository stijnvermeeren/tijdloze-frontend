<template lang="pug">
  div.commentForm(:class="{expanded: isExpanded}")
    div(v-if='isAuthenticated')
      .displayName(v-if='!displayName || editingDisplayName')
        div.changeDisplayName
          | Kies een gebruikersnaam:
          input(:disabled='submittingDisplayName' type='text' v-model='name')
          button(:disabled='submittingDisplayName || invalidDisplayName' @click='submitDisplayName()')
            | Ok
        div.changeDisplayNameInfo(v-if='editingDisplayName')
          | De nieuwe gebruikersnaam wordt ook getoond bij alle berichten die je reeds met deze account geschreven hebt.
      div(v-else)
        div
          div.commentHeader(v-if="isExpanded")
            span.name {{ displayName }}
            span.changeName
              | (
              a(@click='editDisplayName') Gebruikersnaam aanpassen
              | )
          div
            textarea(
              :disabled='submitting'
              cols='60'
              placeholder='Schrijf een nieuwe reactie...'
              :rows='isExpanded ? 4 : 1'
              v-model='message'
              @click.once="onFocus($event)"
            )
          div(v-if="isExpanded")
            button.formsubmit(:disabled='submitting || invalidMessage' @click='submit()')
              | Verzenden
    .message(v-if='!isAuthenticated')
      | Om reacties the plaatsen, moet je je #[a(@click='login()') aanmelden/registeren].
</template>

<script>
  export default {
    props: {
      "expanded": {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isExpanded: !!this.expanded,
        name: "",
        message: "",
        editingDisplayName: false,
        submittingDisplayName: false,
        submitting: false,
      }
    },
    computed: {
      isAuthenticated() {
        return this.$store.getters['auth/isAuthenticated'];
      },
      displayName() {
        return this.$store.getters['auth/displayName'];
      },
      invalidDisplayName() {
        return this.name.length === 0;
      },
      invalidMessage() {
        return this.message.length === 0;
      }
    },
    methods: {
      onFocus(event) {
        this.isExpanded = true;
        this.$nextTick(() => {
          event.target.focus()
        });
      },
      editDisplayName() {
        this.name = this.$store.getters['auth/displayNameWithFallback'];
        this.editingDisplayName = true;
      },
      submitDisplayName() {
        this.submittingDisplayName = true;

        const data = {
          displayName: this.name
        };
        this.$axios.$post(`user/display-name`, data).then(user => {
          this.editingDisplayName = false;
          this.submittingDisplayName = false;
          this.$store.commit('auth/setUser', user);
          this.$emit('displayNameChanged');
        });
      },
      submit() {
        this.submitting = true;

        const data = {
          message: this.message
        };
        this.$axios.$post(`comment`, data).then(response => {
          this.submitting = false;
          this.message = '';
          this.$emit('submitted');
        });
      },
      login() {
        this.$auth.login(this.$route.path);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @use "../../assets/styleConfig";

  div.commentForm {
    padding: 0.3em 1em;
    margin: 1.7em 3em 0.7em 3em;

    &.expanded {
      border: 3px solid styleConfig.$inputBorderColor;
      border-radius: 4px;
    }

    div.commentHeader {
      margin-bottom: 0.2em;

      span.name {
        font-weight: bold;
      }

      span.changeName {
        margin-left: 1em;
        color: #888;
        font-size: 80%;
      }
    }

    textarea {
      width: 100%;
      font-size: 100%;
      padding: 4px 8px;
      box-sizing: border-box;
    }

    div.changeDisplayName {
      input {
        margin: 0 3px 0 6px;
      }
    }

    div.changeDisplayNameInfo {
      margin-top: 0.5em;
      font-style: italic;
      color: #888;
    }
  }
</style>
