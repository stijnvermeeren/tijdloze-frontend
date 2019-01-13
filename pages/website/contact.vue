<template lang="pug">
  div
    h2 Contact

    p.fout(v-if='error') Probleem met het verzenden van je bericht! {{error}}
    div(v-if='success')
      p
        Bedankt voor je mail. #[a(@click='reset()') Verzend een nieuw bericht].
      h3 Verzonden bericht:
      h4 Van:
      p
        | {{name}}
        span(v-if='email.trim()') ({{email}})
      h4 Bericht:
      p.message {{message}}
    div(v-if='inProgress')
      | Bericht wordt verzonden...

    div(v-if='!success && !inProgress')
      p Alle suggesties, verbeteringen of andere berichten zijn van harte welkom!
      table
        tbody
          tr
            th Naam:
            td
              input.formtext(type='text' v-model='name' placeholder='Verplicht veld')
          tr
            th E-mailadres:
            td
              div
                input.formtext(@blur='emailTouched = true' name='email' v-model='email')
              .fout(v-if='emailTouched && email.trim() && !validateEmail(email.trim())')
                | Ongeldig e-mailadres. Voer een correct e-mailadres in, of laat het veld leeg om anoniem te mailen.
          tr
            th Bericht:
            td
              textarea(cols='30' rows='4' v-model='message' placeholder='Verplicht veld')
          tr
            th &nbsp;
            td
              button.formsubmit(@click='submit' :disabled='submitDisabled' type='submit')
                | Bericht verzenden
</template>

<script>
  export default {
    data() {
      return {
        name: this.$store.getters.isAuthenticated ? this.$store.getters.displayNameWithFallback : '',
        email: this.$store.getters.isAuthenticated ? this.$store.state.user.email: '',
        message: "",
        error: null,
        emailTouched: false,
        inProgress: false,
        success: false
      }
    },
    computed: {
      submitDisabled() {
        const nameOk = !!this.name.trim();
        const emailOk = !this.email.trim() || this.validateEmail(this.email.trim());
        const messageOk = !!this.message.trim();
        return !(nameOk && emailOk && messageOk);
      }
    },
    methods: {
      reset() {
        this.message = "";
        this.error = null;
        this.inProgress = false;
        this.success = false;
      },
      submit() {
        this.inProgress = true;
        this.error = "";

        const payLoad = {
          name: this.name.trim(),
          message: this.message
        };
        if (this.email.trim()) {
          payLoad.email = this.email.trim();
        }

        this.$axios.$post('/contact', payLoad).then(response => {
          this.inProgress = false;
          this.success = true;
        }, error => {
          this.inProgress = false;
          this.error = `Foutmelding van de server (${error.message}).`;
        });
      },
      validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
      }
    },
    head: {
      title: "Contact"
    }
  }
</script>

<style lang="less" scoped>
    @import "../../assets/styleConfig";

    .fout {
        color: #CC0000;
    }
    .goed {
        color: #007700;
        font-weight: bold;
    }

    p.message {
        white-space: pre-line;
    }

    th {
        width: 120px;
    }

    input {
        box-sizing: border-box;
        width: 100%;
        padding: 2px 5px;
    }
    button {
        width: 200px;
    }

    textarea {
        box-sizing: border-box;
        width: 100%;
        padding: 2px 5px;
        height: 90px;
        padding: 5px;
    }
</style>
