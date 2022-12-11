<template lang="pug">
  div
    el-alert.alert(:closable="false" show-icon)
      ul
        li Eén nummer (artiest + titel) per lijn
        li Lege lijnen en posities die al gedefinieerd zijn in de lijst worden genegeerd
    div
      el-radio(v-model="importMode" label="manual") Positie in het begin van elke lijn
    div
      el-radio(v-model="importMode" label="auto") Automatisch:
      =" "
      span bovenaan is positie
      =" "
      el-input-number.importStart(
        v-model="importStart"
        :min="1"
        size="small"
        controls-position="right"
        :disabled="importMode !== 'auto'"
      )
      =" "
      span en dan
      =" "
      el-select.importStep(v-model="importStep" :disabled="importMode !== 'auto'")
        el-option(:value="-1" label="stijgend (e.g. van 100 naar 1)")
        el-option(:value="1" label="dalend (e.g. van 1 naar 100)")
    el-input(type="textarea" v-model="importText" :rows="10" :placeholder="importPlaceholder")
    div
      el-button(@click="startImport") Import beginnen
</template>

<script>

export default {
  props: {
    name: "ImportForm",
    startPosition: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      importText: '',
      importMode: 'manual',
      importStart: this.startPosition,
      importStep: -1
    }
  },
  computed: {
    importPlaceholder() {
      if (this.importMode === 'auto') {
        return "Pearl Jam - Black\nFleetwood Mac - The Chain"
      } else {
        return "2 Pearl Jam - Black\n1 Fleetwood Mac - The Chain"
      }
    }
  },
  methods: {
    startImport() {
      const importSongs = []
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
      this.importText = "";
      this.$emit('startImport', importSongs)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>