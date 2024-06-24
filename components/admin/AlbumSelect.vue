<template lang="pug">
div
  v-autocomplete(
    :model-value="modelValue"
    @update:model-value='update'
    :items="candidateAlbums"
    label="Album"
    hide-details
  )
</template>

<script setup>
import _ from "lodash"
import {useRepo} from "pinia-orm";
import Artist from "~/orm/Artist";

const props = defineProps({
  modelValue: {
    type: Number
  },
  artistId: {
    type: Number
  }
})

const candidateAlbums = computed(() => {
  const artist = useRepo(Artist).with('albums').find(props.artistId);
  if (artist) {
    return _.sortBy(
        artist.albums,
        [album => album.releaseYear, album => album.title]
    ).map(album => {
      return {
        value: album.id,
        title: `${album.title} (${album.releaseYear})`
      }
    })
  } else {
    return [];
  }
})

const emit = defineEmits(['update:modelValue'])

function update(newValue) {
  emit('update:modelValue', newValue);
}
</script>
