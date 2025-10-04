<template lang="pug">
span
  template(v-for='fragment in fragments')
    span(v-if='fragment.text' v-html='fragment.text')
    smart-link(v-if='fragment.to' :to='fragment.to')
</template>

<script setup>
import { splitWhen } from 'ramda';

const props = defineProps({
  text: String
})

const fragments = computed(() => {
  let unprocessedText = props.text;
  let fragments = [];

  while (unprocessedText.length > 0) {
    const [text, rest] = splitWhen(char => char === '[')(unprocessedText)
    fragments.push({text: text.join('')});
    unprocessedText = rest.slice(1)

    const [to, rest2] = splitWhen(char => char === ']')(unprocessedText)
    fragments.push({to: to.join('')});
    unprocessedText = rest2.slice(1)
  }

  return fragments;
})
</script>
