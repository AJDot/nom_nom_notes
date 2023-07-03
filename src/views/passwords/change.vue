<template>
  <form
    class="max-w-screen-xs w-full self-center pt-4 px-2"
    @submit.prevent="changePassword"
  >
    <section class="w-full flex flex-col">
      <h2 class="text-2xl border-b border-gray-400 mb-2">
        Change Password
      </h2>
      <dl class="password">
        <dt><label for="password">Password</label></dt>
        <dd>
          <a-input
            id="password"
            v-model="formData.password"
            type="password"
            name="password"
          />
        </dd>
      </dl>
      <dl class="password">
        <dt><label for="password-confirmation">Confirm Password</label></dt>
        <dd>
          <a-input
            id="password-confirmation"
            v-model="formData.passwordConfirmation"
            type="password"
            name="password-confirmation"
          />
        </dd>
      </dl>
      <input
        class="btn"
        type="submit"
        value="Change Password"
      >
    </section>
  </form>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue'
import { plainAxiosInstance } from '~/backend/axios'
import { ApiPath } from '~/router/path'
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
      plainAxiosInstance.put(ApiPath.base() + ApiPath.changePassword(), {
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
