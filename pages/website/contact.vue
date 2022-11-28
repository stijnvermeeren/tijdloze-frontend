<template lang="pug">
  div
    h2 Contact

    el-alert(title="Radio-uitzending en samenstelling van de Tijdloze" :closable="false" show-icon)
      div De makers van deze website zijn #[strong niet betrokken] bij de radio-uitzending of de samenstelling van de Tijdloze.
      div Feedback daarover kan je direct aan #[a(href='https://stubru.be') StuBru] en de #[a(href='https://vrtklantendienst.force.com/s/contactus') VRT] sturen.

    p Hier kan je Stijn Vermeeren, de hoofd-ontwikkelaar van de Tijdloze Website, contacteren.
    p Alle suggesties, verbeteringen of andere berichten omtrent deze website zijn van harte welkom!

    el-alert(v-if='error' type="error" title="Probleem met het verzenden van je bericht!" :closable="false" show-icon)
      | {{error}}
    div(v-if='success')
      el-alert(type="success" title="Bedankt voor je mail!" :closable="false" show-icon)
        a(@click='reset()') Verzend een nieuw bericht
      h3 Verzonden bericht:
      h4 Van:
      p
        | {{name}}
        span(v-if='email.trim()')
        |
        | ({{email}})
      h4 Bericht:
      p.message {{message}}
    div(v-if='inProgress')
      | Bericht wordt verzonden...

    div(v-if='!success && !inProgress')
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
              el-alert(
                v-if='emailTouched && email.trim() && !validateEmail(email.trim())'
                type="warning"
                title="Ongeldig e-mailadres."
                :closable="false"
              )
                | Voer een correct e-mailadres in, of laat het veld leeg om anoniem te mailen.
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
        name: this.$store.getters['auth/isAuthenticated'] ? this.$store.getters['auth/displayNameWithFallback'] : '',
        email: this.$store.getters['auth/isAuthenticated'] ? this.$store.state.auth.user.email: '',
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

<style lang="scss" scoped>
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
        height: 90px;
        padding: 5px;
    }
</style>
