<template lang="pug">
div
  ui-alert
    ul
      li Eén nummer (artiest + titel) per lijn
      li Lege lijnen en posities die al gedefinieerd zijn in de lijst worden genegeerd
  v-checkbox(v-model="reverse" label="Van onder naar boven")
  v-radio-group(v-model="importMode")
    v-radio(v-model="importMode" value="manual" label="Expliciete positie in het begin van elke lijn")
    v-radio(v-model="importMode" value="auto" label="Automatische telling")
    div.d-flex(v-if="importMode === 'auto'")
      v-text-field(
        v-model="importStart"
        :min="1"
        type="number"
        label="Bovenaan is positie"
        hide-details
      )
      =" "
      span en dan
      =" "
      v-select(
        v-model="importStep"
        :items="[{value: -1, title: 'stijgend (e.g. van 100 naar 1)'}, {value: 1, title: 'dalend (e.g. van 1 naar 100)'}]"
        hide-details
      )
    v-radio(v-model="importMode" value="regex" label="Regex")
    div.d-flex(v-if="importMode === 'regex'")
      v-text-field(v-model="regex" :disabled="importMode !== 'regex'")
    v-textarea(v-model="importText" :rows="8" :placeholder="importPlaceholder")
  div
    v-btn(@click="startImport") Import beginnen
</template>

<script setup>

const props = defineProps({
  startPosition: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['startImport'])

const importText = ref('')
const importMode = ref('regex')
const importStart = ref(props.startPosition)
const importStep = ref(-1)
const reverse = ref(true)

const regex = '(?<position>[0-9]+)\\n\\n.+\\n(?<title>.+)\\n\\n(?<artist>.+)'

const importPlaceholder = computed(() => {
  if (importMode.value === 'auto') {
    return "Pearl Jam - Black\nFleetwood Mac - The Chain"
  } else if (importMode.value === 'manual') {
    return "2 Pearl Jam - Black\n1 Fleetwood Mac - The Chain"
  } else {
    return ""
  }
})

function startImport() {
  const importSongs = []
  if (importMode.value === 'regex') {
    importText.value.matchAll(regex).forEach(matchObject => {
      const query = `${matchObject.groups.artist} ${matchObject.groups.title}`
      const overridePosition = parseInt(matchObject.groups.position)
      importSongs.push({
        overridePosition,
        query
      })
    })
  } else {
    const fragments = importText.value.split("\n")

    let overridePosition = importStart.value

    fragments.forEach(fragment => {
      let cleanFragment = fragment
      if (importMode.value === 'manual') {
        overridePosition = undefined
        const positionMatch = fragment.match(/^[0-9]+/g);
        if (positionMatch && positionMatch.length) {
          overridePosition = parseInt(positionMatch[0]);
        }
        cleanFragment = fragment
            .replace(/^[0-9]*[\.]?/g, "")
            .replaceAll("\t", " ")
            .trim()
      }
      if (cleanFragment) {
        importSongs.push({
          overridePosition: overridePosition,
          query: cleanFragment
        })
      }

      if (importMode.value === 'auto') {
        overridePosition += importStep.value
      }
    })
  }

  if (reverse.value) {
    importSongs.reverse()
  }
  importText.value = "";
  emit('startImport', importSongs)
}
</script>

<style lang="scss" scoped>
</style>