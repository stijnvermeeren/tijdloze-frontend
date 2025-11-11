<template lang="pug">
div(v-if='isAuthenticated')
  comments-sheet
    template(#header)
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
    div(v-if="isExpanded && !editingDisplayName")
      v-btn.formsubmit(
        :prepend-icon="mdiSend"
        :disabled='submitting || invalidMessage' @click='submit()'
        density="comfortable"
      )
        | Verzenden
  .message(v-if='!isAuthenticated')
    | Om reacties the plaatsen, moet je je #[nuxt-link(:to="{path: '/auth/login', query: {redirect: route.fullPath}}") aanmelden/registeren].
</template>

<script setup>
import {mdiSend} from "@mdi/js";
import {useAuthStore} from "~/stores/auth";

const {$api} = useNuxtApp()
const emit = defineEmits(['submitted', 'displayNameChanged'])

const props = defineProps({
  "expanded": {
    type: Boolean,
    default: false
  },
  "parentId": {
    type: Number,
    default: undefined
  }
})


const isExpanded = ref(!!props.expanded)
const name = ref("")
const message = ref("")
const editingDisplayName = ref(false)
const submittingDisplayName = ref(false)
const submitting = ref(false)

const route = computed(() => {
  return useRoute()
})
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

function onFocus(event) {
  isExpanded.value = true;
  nextTick(() => {
    event.target.focus()
  });
}

function editDisplayName() {
  name.value = useAuthStore().displayNameWithFallback;
  editingDisplayName.value = true;
}

async function submitDisplayName() {
  submittingDisplayName.value = true;

  const data = {
    displayName: name.value
  };
  useAuthStore().user = await $api(`user/display-name`, useFetchOptsPost(data));
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
  await $api(`comment`, useFetchOptsPost(data))
  submitting.value = false;
  message.value = '';
  emit('submitted');
}
</script>

<style lang="scss" scoped>
  @use "../../assets/styleConfig";

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
