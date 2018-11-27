<template>
    <div>
        <h2>Reageer op de Tijdloze</h2>

        <div class="notabs">
            <h3>Plaats een nieuwe reactie</h3>

            <p v-if="error" class="fout">{{error}}}</p>
            <p v-if="confirmation" class="goed">{{confirmation}}}</p>

            <table>
                <tr>
                    <td class="formlabel">Naam:</td>
                    <td><input v-model="name" :disabled="submitting" type="text" class="formtext" /></td>
                </tr>
                <tr>
                    <td class="formlabel">Bericht:</td>
                    <td><textarea v-model="message" :disabled="submitting" cols="30" rows="4" ></textarea></td>
                </tr>
                <tr>
                    <td class="formlabel">&nbsp;</td>
                    <td><button @click="submit()" :disabled="submitting" class="formsubmit">Verzenden</button></td>
                </tr>
            </table>

            <h3>Alle reacties</h3>

            <div>
                <div v-for="comment in comments" class="reactie">
                    <div class="reacinfo">{{comment.name}} - {{comment.created}}</div>
                    <div class="bericht">{{comment.message}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import _ from 'lodash';

  //

  export default {
    data() {
      return {
        name: "",
        message: "",
        error: undefined,
        confirmation: undefined,
        submitting: false,
      }
    },
    methods: {
      submit() {
        this.submitting = true;
        console.log("submitting");
      }
    },
    async asyncData({ params, app }) {
      const page = params.page || 1;
      return {
        comments: await app.$axios.$get(`comments/${page}`)
      };
    },
    head: {
      title: 'De Tijdloze Tijdloze'
    }
  }
</script>

<style lang="less" scoped>
    @import "../assets/globalStyles.less";

    div.reactie {
        border: @blackLine;
        padding: 0.3em 4em;
        margin: 1em 0;

        &.groen {
            background-color: #b3f9a3;
        }

        div.reacinfo {
            font-size: 90%;
            margin: 0.2em 0 0.4em 0;
            font-weight: bold;
            border-bottom: @blackLine;

            span {
                font-weight: bold;
            }
        }

        div.bericht {
            white-space: pre-wrap;
        }
    }
</style>
