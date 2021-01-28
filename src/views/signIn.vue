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
import { AxiosError, AxiosResponse } from 'axios'
import { SessionActionTypes } from '~/store/modules/sessions/actions'
import { mapGetters } from 'vuex'
import { SessionGetterTypes } from '~/store/modules/sessions/getters'

export default defineComponent({
  name: 'SignIn',
  setup() {
    const getters = mapGetters('sessions', { signedIn: SessionGetterTypes.SIGNED_IN })
    return {
      ...getters,
    }
  },
  data() {
    return {
      formData: {
        email: null,
        password: null,
      },
    }
  },
  computed: {
    ...mapGetters('sessions', { signedIn: SessionGetterTypes.SIGNED_IN }),
  },
  created() {
    this.checkSignedIn()
  },
  updated() {
    this.checkSignedIn()
  },
  methods: {
    signin() {
      this.$store.dispatch(StoreModulePath.Session + SessionActionTypes.CREATE, this.formData)
        .then((response: AxiosResponse) => this.signinSuccessful(response))
        .catch((error: AxiosError) => this.signinError(error))
    },
    signinSuccessful(response: AxiosResponse) {
      if (!this.signedIn) {
        this.signinFailed(response)
        return
      }
      this.$routerExtension.replace({ name: this.$routerExtension.names.Home })
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
        this.$router.replace({ name: this.$routerExtension.names.Home })
      }
    },
  },
})
</script>
