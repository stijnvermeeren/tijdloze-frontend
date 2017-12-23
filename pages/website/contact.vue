<template>
    <div>

        <p v-if="error" class="fout">Probleem met het verzenden van je bericht! {{error}}</p>

        <div v-if="success" class="fout">
            <p>Bedankt voor je mail. <a href="#" @click="reset()">Verzend een nieuw bericht</a>.</p>
            <h3>Verzonden bericht:</h3>
            <h4>Van:</h4><p>{{name}} <span v-if="email.trim()">({{email}})</span></p>
            <h4>Bericht:</h4><p class="message">{{message}}</p>
        </div>

        <div v-if="inProgress">
            Bericht wordt verzonden...
        </div>

        <div v-if="!success && !inProgress">
            <p>Alle suggesties, verbeteringen of andere berichten zijn van harte welkom!</p>

            <table>
                <tbody>
                    <tr>
                        <td class="formlabel">Jouw naam:</td>
                        <td><input type="text" class="formtext" v-model="name" /></td>
                    </tr>

                    <tr>
                        <td class="formlabel">Jouw e-mailadres:</td>
                        <td><input class="formtext" name="email" v-model="email" /></td>
                    </tr>
                    <tr>
                        <td class="formlabel">Bericht:</td>
                        <td><textarea cols="30" rows="4" v-model="message"></textarea></td>
                    </tr>
                    <tr>
                        <td class="formlabel">&nbsp;</td>
                        <td><input @click="submit()" type="submit" class="formsubmit" value="Bericht verzenden" /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        name: "",
        email: "",
        message: "",
        error: null,
        inProgress: false,
        success: false
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
        this.error = this.checkForError();

        if (!this.error) {
          const payLoad = {
            name: this.name.trim(),
            message: this.message
          };
          if (this.email.trim()) {
            payLoad.email = this.email.trim();
          }

          this.inProgress = true;
          this.$axios.$post('/contact', payLoad).then(response => {
            this.inProgress = false;
            this.success = true;
          }, error => {
            this.inProgress = false;
            this.error = `Foutmelding van de server (${error.message}).`;
          });
        }
      },
      checkForError() {
        if (!this.name.trim()) {
          return "Voer je naam in."
        }
        if (this.email.trim() && !this.validateEmail(this.email.trim())) {
          return "Ongeldig e-mailadres. Voer een correct e-mailadres in, of laat het veld leeg om anoniem te mailen."
        }
        return null;
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

    p.fout {
        color: #CC0000;
        font-weight: bold;
    }
    p.goed {
        color: #007700;
        font-weight: bold;
    }

    p.message {
        white-space: pre-line;
    }

    td.bold, td.formlabel {
        font-weight: bold;
    }
    input[type="text"] input[type="password"] {
        width: 350px;
        background-color: @inputBackgroundColor;
        padding: 2px 5px;
        font-size: 95%;
        border-color: @inputBorderColor;
    }
    input.small {
        width: 200px;
    }
    input.ch, #inhoud input.ra {
        width: 1em;
        height: 1em;
    }
    input[type=submit], input.formsubmit {
        width: 360px;
        padding: 0;
        font-weight: bold;
    }
    select {
        width: 360px;
        background-color: @inputBackgroundColor;
        font-size: 13px;
        border-color: @inputBorderColor;
    }
    textarea {
        width: 350px;
        height: 90px;
        background-color: @inputBackgroundColor;
        padding: 5px;
        font-family: Arial, sans-serif;
        font-size: 95%;
        border-color: @inputBorderColor;
    }
</style>
