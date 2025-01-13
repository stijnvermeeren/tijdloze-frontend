<template lang="pug">
div.commentForm(:class="{expanded: isExpanded}")
  div(v-if='isAuthenticated')
    .displayName(v-if='!displayName || editingDisplayName')
      div.d-flex
        v-text-field.mr-4(:disabled='submittingDisplayName' v-model='name' label="Kies een gebruikersnaam" hide-details)
        v-btn(:disabled='submittingDisplayName || invalidDisplayName' @click='submitDisplayName()')
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
            :rows='isExpanded ? 4 : 1'
            v-model='message'
            @click.once="onFocus($event)"
            hide-details
          )
        div(v-if="isExpanded")
          v-btn.formsubmit(:disabled='submitting || invalidMessage' @click='submit()')
            | Verzenden
  .message(v-if='!isAuthenticated')
    | Om reacties the plaatsen, moet je je #[nuxt-link(:to="{path: '/auth/login', query: {redirect: route.fullPath}}") aanmelden/registeren].
</template>

<script setup>
import {useAuthStore} from "~/stores/auth";

const {$api} = useNuxtApp()
const emit = defineEmits(['submitted', 'displayNameChanged'])

const props = defineProps({
  "expanded": {
    type: Boolean,
    default: false
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
  const user = await $api(`user/display-name`, useFetchOptsPost(data))
  editingDisplayName.value = false;
  submittingDisplayName.value = false;
  useAuthStore().setUser(user);
  emit('displayNameChanged');
}

async function submit() {
  submitting.value = true;

  const data = {
    message: message.value
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

  div.commentForm {
    padding: 0.3em 1em;
    margin: 0.7em 3em;

    div.commentHeader {
      margin-bottom: 0.2em;

      span.name {
        font-weight: bold;
      }

      span.changeName {
        margin-left: 1em;
        color: #888;
        font-size: 80%;
      }
    }

    div.changeDisplayNameInfo {
      margin-top: 0.5em;
      font-style: italic;
      color: #888;
    }
  }
</style>
