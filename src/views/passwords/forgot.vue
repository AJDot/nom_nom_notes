<template>
  <form
    class="max-w-screen-xs w-full self-center pt-4 px-2"
    @submit.prevent="requestForgotPassword"
  >
    <section class="w-full flex flex-col">
      <h2 class="text-2xl border-b border-gray-400 mb-2">
        Forgot Password
      </h2>
      <dl class="email">
        <dt><label for="email">Email</label></dt>
        <dd>
          <a-input
            id="email"
            v-model="formData.email"
            type="email"
            name="email"
          />
        </dd>
      </dl>
      <input
        class="btn"
        type="submit"
        value="Request Password Reset"
      >
    </section>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SessionGetterTypes } from '~/store/modules/sessions/getters'
import { mapGetters } from 'vuex'
import { securedAxiosInstance } from '~/backend/axios'
import { AxiosError, AxiosResponse } from 'axios'
import { StoreModulePath } from '~/store'
import { FlashActionTypes } from '~/store/modules/flash'
import { RouteName } from '~/router/routeName'
import { AppPath, ApiPath } from '~/router/path'

export default defineComponent({
  name: 'ForgotPassword',
  setup() {
    const getters = mapGetters('sessions', { signedIn: SessionGetterTypes.SIGNED_IN })
    return {
      ...getters,
    }
  },
  data() {
    return {
      formData: {
        email: '',
        originUrl: AppPath.base() + AppPath.changePassword(),
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
    requestForgotPassword() {
      securedAxiosInstance.put(ApiPath.base() + ApiPath.forgotPassword(), this.formData)
        .then((response: AxiosResponse) => this.requestSuccessful(response))
        .catch((error: AxiosError) => this.requestError(error))
    },
    async requestSuccessful(response: AxiosResponse) {
      if (response.data?.error) {
        this.requestFailed(response)
        return
      }
      await this.$router.push({
        name: RouteName.SignIn,
        params: { email: this.formData.email },
      })
      this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
        flash: { success: 'A request to change your password was made. Please check your email for instructions.' },
      })
    },
    requestFailed(error: AxiosResponse) {
      this.processFailedSignin(error?.data?.error)
    },
    requestError(error: AxiosError) {
      this.processFailedSignin(error.response?.data.error)
    },
    processFailedSignin(errorText: string | null | undefined) {
      if (errorText) {
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: errorText },
        })
      }
    },
    checkSignedIn() {
      if (localStorage.signedIn) {
        this.$router.replace({ name: this.$routerExtension.names.Home })
      }
    },
  },
})
</script>
