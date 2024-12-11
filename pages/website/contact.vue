<template lang="pug">
Title Contact
div
  h2 Contact

  ui-alert(title="Radio-uitzending en samenstelling van de Tijdloze")
    div De makers van deze website zijn #[strong niet betrokken] bij de radio-uitzending of de samenstelling van de Tijdloze.
    div Feedback daarover kan je direct aan #[a(href='https://stubru.be') StuBru] en de #[a(href='https://vrtklantendienst.force.com/s/contactus') VRT] sturen.

  p Hier kan je Stijn Vermeeren, de hoofd-ontwikkelaar van tijdloze.rocks, contacteren.
  p Alle suggesties, verbeteringen of andere berichten omtrent deze website zijn van harte welkom!

  ui-alert(v-if='error' type="error" title="Probleem met het verzenden van je bericht!")
    | {{error}}
  div(v-if='success')
    ui-alert(type="success" title="Bedankt voor je mail!")
      a(@click='reset()') Verzend een nieuw bericht
    ui-card(title="Verzonden bericht" :subtitle="cardSubtitle")
      p.message {{message}}
  div(v-if='inProgress')
    | Bericht wordt verzonden...

  div(v-if='!success && !inProgress')
    v-container
      v-row(dense)
        v-col
          v-text-field.formtext(label="Naam *" type='text' v-model='name' hide-details)
      v-row(dense)
        v-col
          v-text-field.formtext(label="E-mailadres" @blur='emailTouched = true' name='email' v-model='email' hide-details)
          ui-alert(
            v-if='emailTouched && email.trim() && !validateEmail(email.trim())'
            type="warning"
            title="Ongeldig e-mailadres."
          )
            | Voer een correct e-mailadres in, of laat het veld leeg om anoniem te mailen.
      v-row(dense)
        v-col
          v-textarea(label="Bericht *" cols='30' rows='4' v-model='message' hide-details)
      v-row
        v-col
          v-btn.formsubmit(@click='submit' :disabled='submitDisabled' type='submit')
            | Bericht verzenden
</template>

<script>
  import {useAuthStore} from "~/stores/auth";

  export default {
    data() {
      return {
        name: useAuthStore().isAuthenticated ? useAuthStore().displayNameWithFallback : '',
        email: useAuthStore().isAuthenticated ? useAuthStore().user.email || '' : '',
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
      },
      cardSubtitle() {
        const from = `Van ${this.name}`
        if (this.email.trim()) {
          return `${from} (${this.email})`
        } else {
          return from
        }
      }
    },
    methods: {
      reset() {
        this.message = "";
        this.error = null;
        this.inProgress = false;
        this.success = false;
      },
      async submit() {
        this.inProgress = true;
        this.error = "";

        const payLoad = {
          name: this.name.trim(),
          message: this.message
        };
        if (this.email.trim()) {
          payLoad.email = this.email.trim();
        }

        const result = await $fetch('/contact', useFetchOptsPost(payLoad)).catch(err => {
          this.inProgress = false;
          this.error = `Foutmelding van de server: ${err}.`;
        })
        if (result !== undefined) {
          this.inProgress = false;
          this.success = true;
        }
      },
      validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
      }
    }
  }
</script>

<style lang="scss" scoped>
    p.message {
        white-space: pre-line;
    }
</style>
