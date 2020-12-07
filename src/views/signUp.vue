<template>
  <form
    class="sign_up"
    @submit.prevent="signup"
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
import { RouteName } from '~/router/routeName'
import RoutePath from '~/router/path'

export default defineComponent({
  name: 'SignUp',
  data() {
    return {
      formData: {
        email: null,
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
      this.$http.plain
        .post(RoutePath.signup(), { ...this.formData })
        .then((response) => this.signupSuccessful(response))
        .catch((error) => this.signupFailed(error))
    },
    signupSuccessful(response) {
      if (!response.data.csrf) {
        this.signupFailed(response)
        return
      }
      this.$store.commit(
        StoreModulePath.Session + SessionMutationTypes.SIGN_IN,
        response.data.csrf,
      )
      this.$router.replace({ name: RouteName.Home })
    },
    signupFailed(error) {
      const errorText = error?.response?.data?.error
      if (errorText) {
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: errorText },
        })
      }
      this.$store.commit(
        StoreModulePath.Session + SessionMutationTypes.SIGN_OUT,
      )
    },
    checkSignedIn() {
      if (localStorage.signedIn) {
        this.$router.replace({ name: RouteName.Home })
      }
    },
  },
})
</script>
