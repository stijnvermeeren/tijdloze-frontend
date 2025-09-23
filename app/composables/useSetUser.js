import {useAuth0} from "@auth0/auth0-vue";
import {usePollStore} from "~/stores/poll";
import {useAuthStore} from "~/stores/auth";

export default async function (auth0) {
  const {$api} = useNuxtApp()
  const user = auth0.user.value
  if (user) {
    useAuthStore().accessToken = await auth0.getAccessTokenSilently()

    const data = {
      name: user.name,
      firstName: user.given_name,
      lastName: user.family_name,
      nickname: user.nickname,
      email: user.email,
      emailVerified: user.email_verified
    };
    useAuthStore().user = await $api('user', useFetchOptsPost(data))

    // TODO don't do await, do it in the background instead
    const pollData = await $api('poll/my-votes')
    usePollStore().votes = pollData.votes;
  } else {
    useAuthStore().user = null;
    useAuthStore().accessToken = null;
  }
}
