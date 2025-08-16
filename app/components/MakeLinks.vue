<template lang="pug">
span
  template(v-for='fragment in fragments')
    span(v-if='fragment.text' v-html='fragment.text')
    smart-link(v-if='fragment.to' :to='fragment.to')
</template>

<script setup>
import _ from 'lodash';

const props = defineProps({
  text: String
})

const fragments = computed(() => {
  let unprocessedText = props.text;
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
})
</script>
