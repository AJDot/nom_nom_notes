<template>
  <form class="sign_in" @submit.prevent="signin">
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
    <input class="btn" type="submit" value="Sign In" />
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { StoreModulePath } from '~/store'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import { FlashActionTypes } from '~/store/modules/flash'

export default defineComponent({
  name: "sign-in",
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
      this.$http.plain.post('/signin', { ...this.formData })
        .then(response => this.signinSuccessful(response))
        .catch(error => this.signinFailed(error))
    },
    signinSuccessful(response) {
      if (!response.data.csrf) {
        this.signinFailed(response)
        return
      }
      this.$store.commit(StoreModulePath.Session + SessionMutationTypes.SIGN_IN, response.data.csrf)
      this.error = ''
      this.$router.replace({ name: "home" })
    },
    signinFailed(error) {
      const errorText = error?.response?.data?.error ?? error?.data?.error
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
