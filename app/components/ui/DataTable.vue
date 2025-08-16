<template lang="pug">
v-data-table(
  v-if="years.length"
  :items="data"
  :headers="headers"
  density="compact"
  :items-per-page="-1"
  hide-default-footer
)
  template(v-slot:header.yearsGroup)
    div.d-flex.justify-center
      v-select(
        v-model="selectedYearGroupIndex"
        :items="yearGroupsOptions"
        density="compact"
        hide-details
        max-width="12em"
      )
  template(v-slot:item.name="{value}")
    slot(name="itemName" :value="value")
      | {{value}}

</template>

<script setup>
const CHUNK_LENGTH = 8

const props = defineProps({
  data: Array,
  propertyName: {
    type: String,
    default: ""
  },
  totalName: {
    type: String,
    default: "Totaal"
  }
})

const {years} = storeToRefs(useYearStore())

const yearGroups = computed(() => {
  const yearsLength = years.value.length
  const results = []
  for (let i = 0; i <= (yearsLength - 1) / CHUNK_LENGTH; i++) {
    const yearsChunk = years.value.slice(
        Math.max(0, yearsLength - CHUNK_LENGTH * (i + 1)),
        yearsLength - CHUNK_LENGTH * i
    ).map(year => {
      return {
        yyyy: year.yyyy,
        _yy: year._yy
      }
    })
    results.push(yearsChunk)
  }
  return results
})

const yearGroupsOptions = computed(() => {
  return yearGroups.value.map((yearsChunk, index) => {
    const firstYear = yearsChunk[0]
    const lastYear = yearsChunk[yearsChunk.length - 1]
    return {
      title: `${firstYear.yyyy} - ${lastYear.yyyy}`,
      value: index
    }
  })
})

const selectedYearGroupIndex = ref(0)

const selectedYears = computed(() => {
  if (yearGroups.value.length > selectedYearGroupIndex.value) {
    return yearGroups.value[selectedYearGroupIndex.value]
  }
})

const headers = computed(() => {
  const yearHeaders = selectedYears.value.map(year => {
    return {
      title: year._yy,
      value: `perYear.${year.yyyy}`,
      align: 'center',
      headerProps: { style: 'font-weight: bold'}
    }
  })
  return [
    {
      title: props.propertyName,
      key: 'name',
      value: 'entry',
      align: 'center',
      cellProps: { style: 'font-weight: bold'},
      headerProps: { style: 'font-weight: bold'}
    },
    {
      key: 'yearsGroup',
      align: 'center',
      children: yearHeaders,
    },
    {
      title: props.totalName,
      value: 'total',
      align: 'center',
      cellProps: { style: 'font-weight: bold'},
      headerProps: { style: 'font-weight: bold'}
    }
  ]
})
</script>

<style lang="scss" scoped>
.v-table {
  padding: 0 2em;
  th {
    font-weight: bold !important;
  }
}
</style>