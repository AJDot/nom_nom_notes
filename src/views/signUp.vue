<template>
  <form class="sign_up" @submit.prevent="signup">
    <h2>Sign In</h2>
    <dl class="email">
      <dt><label for="email">Email</label></dt>
      <dd>
        <input v-model="formData.email" type="text" name="email" id="email" />
      </dd>
    </dl>
    <dl class="password">
      <dt><label for="password">Password</label></dt>
      <dd>
        <input v-model="formData.password" type="password" name="password" id="password" />
      </dd>
    </dl>
    <dl class="password">
      <dt><label for="password_confirmation">Confirm Password</label></dt>
      <dd>
        <input
          v-model="formData.passwordConfirmation"
          type="password"
          name="password_confirmation"
          id="password_confirmation"
        />
      </dd>
    </dl>
    <input class="btn" type="submit" value="Sign Up" />
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { StoreModulePath } from '~/store'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import { FlashActionTypes } from '~/store/modules/flash'

export default defineComponent({
  name: "sign-up",
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
      this.$http.plain.post('/signup', { ...this.formData })
        .then(response => this.signupSuccessful(response))
        .catch(error => this.signupFailed(error))
    },
    signupSuccessful(response) {
      if (!response.data.csrf) {
        this.signupFailed(response)
        return
      }
      this.$store.commit(StoreModulePath.Session + SessionMutationTypes.SIGN_IN, response.data.csrf)
      this.error = ''
      this.$router.replace({ name: "home" })
    },
    signupFailed(error) {
      const errorText = error?.response?.data?.error
      if (errorText) this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, { flash: { alert: errorText } })
      this.$store.commit(StoreModulePath.Session + SessionMutationTypes.SIGN_OUT)
    },
    checkSignedIn() {
      if (localStorage.signedIn) {
        this.$router.replace({ name: "home" })
      }
    },
  },
})
</script>
