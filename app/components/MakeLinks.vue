<template lang="pug">
span
  template(v-for='fragment in fragments')
    span(v-if='fragment.text' v-html='fragment.text')
    smart-link(v-if='fragment.to' :to='fragment.to')
</template>

<script setup>
import takeWhile from 'ramda/src/takeWhile';
import dropWhile from 'ramda/src/dropWhile';

const props = defineProps({
  text: String
})

const fragments = computed(() => {
  let unprocessedText = props.text;
  let fragments = [];

  while (unprocessedText.length > 0) {
    fragments.push({
      text: takeWhile(char => char !== '[')(unprocessedText)
    });
    unprocessedText = dropWhile(char => char !== '[')(unprocessedText).slice(1);

    fragments.push({
      to: takeWhile(char => char !== ']')(unprocessedText)
    });
    unprocessedText = dropWhile(char => char !== ']')(unprocessedText).slice(1);
  }

  return fragments;
})
</script>
