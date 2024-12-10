import {useAuth0} from "@auth0/auth0-vue";
import {usePollStore} from "~/stores/poll";
import {useAuthStore} from "~/stores/auth";

export default async function (auth0) {
  const user = auth0.user
  if (user) {
    useAuthStore().setAccessToken(await auth0.getAccessTokenSilently())

    const data = {
      name: user.name,
      firstName: user.given_name,
      lastName: user.family_name,
      nickname: user.nickname,
      email: user.email,
      emailVerified: user.email_verified
    };
    const userData = await $fetch('user', useFetchOptsPost(data))
    useAuthStore().setUser(userData);

    // TODO don't do await, do it in the background instead
    const pollData = await $fetch('poll/my-votes', useFetchOpts())
    usePollStore().setVotes(pollData.votes);
  } else {
    useAuthStore().setUser( null);
    useAuthStore().setAccessToken( null);
  }
}
