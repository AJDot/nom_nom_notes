<template>
  <form
    class="sign_in"
    @submit.prevent="signin"
  >
    <h2>Sign In</h2>
    <dl class="email">
      <dt><label for="email">Email</label></dt>
      <dd>
        <input
          id="email"
          v-model="formData.email"
          type="text"
          name="email"
        >
      </dd>
    </dl>
    <dl class="password">
      <dt><label for="password">Password</label></dt>
      <dd>
        <input
          id="password"
          v-model="formData.password"
          type="password"
          name="password"
        >
      </dd>
    </dl>
    <input
      class="btn"
      type="submit"
      value="Sign In"
    >
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { StoreModulePath } from '~/store'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import { FlashActionTypes } from '~/store/modules/flash'
import { RouteName } from '~/router/routeName'
import RoutePath from '~/router/path'
import { AxiosError, AxiosResponse } from 'axios'

export default defineComponent({
  name: 'SignIn',
  data() {
    return {
      formData: {
        email: null,
        password: null,
      },
    }
  },
  created() {
    this.checkSignedIn()
  },
  updated() {
    this.checkSignedIn()
  },
  methods: {
    signin() {
      this.$http.plain
        .post(RoutePath.signin(), { ...this.formData })
        .then((response) => this.signinSuccessful(response))
        .catch((error) => this.signinError(error))
    },
    signinSuccessful(response: AxiosResponse) {
      if (!response.data.csrf) {
        this.signinFailed(response)
        return
      }
      this.$store.commit(
        StoreModulePath.Session + SessionMutationTypes.SIGN_IN,
        response.data.csrf,
      )
      this.$router.replace({ name: RouteName.Home })
    },
    signinFailed(error: AxiosResponse) {
      this.processFailedSignin(error?.data?.error)
    },
    signinError(error: AxiosError) {
      this.processFailedSignin(error.response?.data.error)
    },
    processFailedSignin(errorText: string | null | undefined) {
      if (errorText) {
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: errorText },
        })
      }
      this.$store.commit(StoreModulePath.Session + SessionMutationTypes.SIGN_OUT)
    },
    checkSignedIn() {
      if (localStorage.signedIn) {
        this.$router.replace({ name: RouteName.Home })
      }
    },
  },
})
</script>
