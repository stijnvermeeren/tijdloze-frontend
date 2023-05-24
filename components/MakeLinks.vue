<template lang="pug">
span
  template(v-for='fragment in fragments')
    span(v-if='fragment.text' v-html='fragment.text')
    smart-link(v-if='fragment.to' :to='fragment.to')
</template>

<script>
  import _ from 'lodash';

  export default {
    props: {
      text: String
    },
    computed: {
      fragments() {
        let unprocessedText = this.text;
        let fragments = [];

        while (unprocessedText.length > 0) {
          fragments.push({
            text: _.takeWhile(unprocessedText, char => char !== '[').join("")
          });
          unprocessedText = _.drop(_.dropWhile(unprocessedText, char => char !== '['), 1);

          fragments.push({
            to: _.takeWhile(unprocessedText, char => char !== ']').join("")
          });
          unprocessedText = _.drop(_.dropWhile(unprocessedText, char => char !== ']'), 1);
        }

        return fragments;
      }
    }
  }
</script>
