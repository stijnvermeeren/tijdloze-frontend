<template lang="pug">
span
  template(v-for='fragment in fragments')
    span(v-if='fragment.text' v-html='fragment.text')
    smart-link(v-if='fragment.to' :to='fragment.to')
</template>

<script setup lang="ts">
type Fragment = {
  text?: string
  to?: string
}

const props = withDefaults(defineProps<{
  text?: string
}>(), {
  text: ""
})

const fragments = computed<Fragment[]>(() => {
  let unprocessedText = props.text
  const results: Fragment[] = []

  while (unprocessedText.length > 0) {
    const openIndex = unprocessedText.indexOf('[')
    if (openIndex === -1) {
      results.push({ text: unprocessedText })
      break
    }

    if (openIndex > 0) {
      results.push({ text: unprocessedText.slice(0, openIndex) })
    }

    const rest = unprocessedText.slice(openIndex + 1)
    const closeIndex = rest.indexOf(']')
    if (closeIndex === -1) {
      results.push({ text: `[${rest}` })
      break
    }

    const to = rest.slice(0, closeIndex)
    results.push({ to })
    unprocessedText = rest.slice(closeIndex + 1)
  }

  return results
})
</script>
