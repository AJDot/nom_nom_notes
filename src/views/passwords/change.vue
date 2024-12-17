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
import { ApiPath } from '~/router/path'
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
    async changePassword() {
      fetch(ApiPath.base() + ApiPath.changePassword(), {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
        ...this.formData,
          token: this.$routerExtension.currentRoute.query.token,
        })
      })
        .then((response: Response) => this.changeSuccessful(response))
        .catch((error: Response) => this.changeError(error))
    },
    async changeSuccessful(response: Response) {
      const responseClone = response.clone()
      const json = await response.json()
      if (json?.error) {
        this.changeFailed(responseClone)
        return
      }
      await this.$router.push({
        name: RouteName.SignIn,
      })
      this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
        flash: { success: 'Password was reset successfully. Please sign in.' },
      })
    },
    async changeFailed(response: Response) {
      const json = await response.json()
      this.processFailedRequest(json?.error)
    },
    async changeError(response: Response) {
      const json = await response.json()
      this.processFailedRequest(json?.data.error)
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
