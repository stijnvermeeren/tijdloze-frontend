<template lang="pug">
  comments-sheet
    template(#header v-if='isAuthenticated')
      .displayName(v-if='!displayName || editingDisplayName')
        div.d-flex
          v-text-field.mr-4(
            :disabled='submittingDisplayName'
             v-model='name' 
             label="Kies een gebruikersnaam" 
             hide-details
             density="comfortable"
          )
          v-btn(
            :disabled='submittingDisplayName || invalidDisplayName' 
            @click='submitDisplayName()'
            density="comfortable"
          )
            | Ok
        div.changeDisplayNameInfo(v-if='editingDisplayName')
          | De nieuwe gebruikersnaam wordt ook getoond bij alle berichten die je reeds met deze account geschreven hebt.
      div(v-else)
        div
          div.commentHeader(v-if="isExpanded")
            span.name {{ displayName }}
            span.changeName
              | (
              a(@click='editDisplayName') Gebruikersnaam aanpassen
              | )
          div
            v-textarea(
              :disabled='submitting'
              label='Schrijf een nieuwe reactie...'
              v-model='message'
              @click.once="onFocus($event)"
              hide-details
              rows="1"
              auto-grow
              density="comfortable"
            )
    div(v-if="isAuthenticated && isExpanded && !editingDisplayName")
      v-btn.formsubmit(
        :prepend-icon="mdiSend"
        :disabled='submitting || invalidMessage' @click='submit()'
        density="comfortable"
      )
        | Verzenden
    .message(v-if='!isAuthenticated')
      | Om reacties te plaatsen, moet je je #[nuxt-link(:to="{path: '/auth/login', query: {redirect: route.fullPath}}") aanmelden/registeren].
</template>

<script setup lang="ts">
import {mdiSend} from "@mdi/js";
import { apiEndpoints } from '~/api/endpoints'
import {useAuthStore} from "~/stores/auth";
const emit = defineEmits(['submitted', 'displayNameChanged'])

const props = withDefaults(defineProps<{
  expanded?: boolean
  parentId?: number
}>(), {
  expanded: false,
})


const isExpanded = ref(!!props.expanded)
const name = ref("")
const message = ref("")
const editingDisplayName = ref(false)
const submittingDisplayName = ref(false)
const submitting = ref(false)

const route = useRoute()
const isAuthenticated = computed(() => {
  return useAuthStore().isAuthenticated;
})
const displayName = computed(() => {
  return useAuthStore().displayName;
})
const invalidDisplayName = computed(() => {
  return name.value.length === 0;
})
const invalidMessage = computed(() => {
  return message.value.length === 0;
})

function onFocus(event: FocusEvent) {
  isExpanded.value = true;
  nextTick(() => {
    (event.target as HTMLTextAreaElement | null)?.focus()
  });
}

function editDisplayName() {
  name.value = useAuthStore().displayNameWithFallback ?? '';
  editingDisplayName.value = true;
}

async function submitDisplayName() {
  submittingDisplayName.value = true;

  const data = {
    displayName: name.value
  };
  useAuthStore().user = await useNuxtApp().$api(apiEndpoints.user.displayName(), data);
  editingDisplayName.value = false;
  submittingDisplayName.value = false;
  emit('displayNameChanged');
}

async function submit() {
  submitting.value = true;

  const data = {
    message: message.value,
    parentId: props.parentId
  };
  await useNuxtApp().$api(apiEndpoints.comment.create(), data)
  submitting.value = false;
  message.value = '';
  emit('submitted');
}
</script>

<style scoped>
  @import "../../assets/styleConfig.css";

  .d-flex {
    align-items: center;
  }

  span.name {
    font-weight: bold;
  }

  span.changeName {
    margin-left: 1em;
    color: #888;
    font-size: 80%;
  }

  div.changeDisplayNameInfo {
    margin-top: 0.5em;
    font-style: italic;
    color: #888;
  }
</style>
