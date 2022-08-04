<template>
  <form
    class="sign-in"
    @submit.prevent="changePassword"
  >
    <h2>Change Password</h2>
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
      <dt><label for="password-confirmation">Confirm Password</label></dt>
      <dd>
        <input
          id="password-confirmation"
          v-model="formData.passwordConfirmation"
          type="password"
          name="password-confirmation"
        >
      </dd>
    </dl>
    <input
      class="btn"
      type="submit"
      value="Change Password"
    >
  </form>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue'
import { plainAxiosInstance } from '~/backend/axios'
import RoutePath from '~/router/path'
import { AxiosError, AxiosResponse } from 'axios'
import { RouteName } from '~/router/routeName'
import { StoreModulePath } from '~/store'
import { FlashActionTypes } from '~/store/modules/flash'

export default defineComponent({
  name: 'ChangePassword',
  setup() {
    return {
      formData: ref({
        password: null,
        passwordConfirmation: null,
      }),
    }
  },
  methods: {
    changePassword() {
      plainAxiosInstance.put(RoutePath.apiBase() + RoutePath.changePassword(), {
        ...this.formData,
        token: this.$routerExtension.currentRoute.query.token,
      })
        .then((response: AxiosResponse) => this.changeSuccessful(response))
        .catch((error: AxiosError) => this.changeError(error))
    },
    async changeSuccessful(response: AxiosResponse) {
      if (response.data?.error) {
        this.changeFailed(response)
        return
      }
      await this.$router.push({
        name: RouteName.SignIn,
      })
      this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
        flash: { success: 'Password was reset successfully. Please sign in.' },
      })
    },
    changeFailed(error: AxiosResponse) {
      this.processFailedRequest(error?.data?.error)
    },
    changeError(error: AxiosError) {
      this.processFailedRequest(error.response?.data.error)
    },
    processFailedRequest(errorText: string | null | undefined) {
      if (errorText) {
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: errorText },
        })
      }
    },
  },
})
</script>
