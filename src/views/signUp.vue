<template>
  <form
    class="sign_up"
    @submit.prevent="signup"
  >
    <h2>Sign Up</h2>
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
    <a-input
      id="username"
      v-model="formData.username"
      type="text"
      name="username"
    >
      <template #label-text>
        Username
      </template>
    </a-input>
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
    <dl class="password">
      <dt><label for="password_confirmation">Confirm Password</label></dt>
      <dd>
        <input
          id="password_confirmation"
          v-model="formData.passwordConfirmation"
          type="password"
          name="password_confirmation"
        >
      </dd>
    </dl>
    <input
      class="btn"
      type="submit"
      value="Sign Up"
    >
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { StoreModulePath } from '~/store'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import { FlashActionTypes } from '~/store/modules/flash'
import { AxiosError, AxiosResponse } from 'axios'
import { SignupActionTypes } from '~/store/modules/signups/actions'

export default defineComponent({
  name: 'SignUp',
  data() {
    return {
      formData: {
        email: null,
        username: null,
        password: null,
        passwordConfirmation: null,
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
    signup() {
      this.$store.dispatch(StoreModulePath.Signup + SignupActionTypes.CREATE, this.formData)
        .then((response) => this.signupSuccessful(response))
        .catch((error) => this.signupError(error))
    },
    signupSuccessful(response: AxiosResponse) {
      if (!response.data.csrf) {
        this.signupFailed(response)
        return
      }
      this.$router.replace({ name: this.$routerExtension.names.Home })
    },
    signupFailed(error: AxiosResponse) {
      this.processFailedSignup(error?.data?.error)
    },
    signupError(error: AxiosError) {
      this.processFailedSignup(error.response?.data.error)
    },
    processFailedSignup(errorText: string | null | undefined) {
      if (errorText) {
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: errorText },
        })
      }
      this.$store.commit(StoreModulePath.Session + SessionMutationTypes.SIGN_OUT)
    },
    checkSignedIn() {
      if (localStorage.signedIn) {
        this.$router.replace({ name: this.$routerExtension.names.Home })
      }
    },
  },
})
</script>
