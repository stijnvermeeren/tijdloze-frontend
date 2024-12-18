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

<script>

export default {
  props: {
    startPosition: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      importText: '',
      importMode: 'regex',
      importStart: this.startPosition,
      importStep: -1,
      reverse: true,
      regex: '(?<position>[0-9]+)\\n\\n.+\\n(?<title>.+)\\n\\n(?<artist>.+)'
    }
  },
  computed: {
    importPlaceholder() {
      if (this.importMode === 'auto') {
        return "Pearl Jam - Black\nFleetwood Mac - The Chain"
      } else if (this.importMode === 'manual') {
        return "2 Pearl Jam - Black\n1 Fleetwood Mac - The Chain"
      } else {
        return ""
      }
    }
  },
  methods: {
    startImport() {
      const importSongs = []
      if (this.importMode === 'regex') {
        this.importText.matchAll(this.regex).forEach(matchObject => {
          const query = `${matchObject.groups.artist} ${matchObject.groups.title}`
          const overridePosition = parseInt(matchObject.groups.position)
          importSongs.push({
            overridePosition,
            query
          })
        })
      } else {
        const fragments = this.importText.split("\n")

        let overridePosition = this.importStart

        fragments.forEach(fragment => {
          let cleanFragment = fragment
          if (this.importMode === 'manual') {
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

          if (this.importMode === 'auto') {
            overridePosition += this.importStep
          }
        })
      }

      if (this.reverse) {
        importSongs.reverse()
      }
      this.importText = "";
      this.$emit('startImport', importSongs)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>