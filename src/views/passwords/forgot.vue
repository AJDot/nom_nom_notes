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
import { mapGetters } from 'vuex'
import { ApiPath, AppPath } from '~/router/path'
import { RouteName } from '~/router/routeName'
import { StoreModulePath } from '~/store'
import { FlashActionTypes } from '~/store/modules/flash'
import { SessionGetterTypes } from '~/store/modules/sessions/getters'

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
      fetch(ApiPath.base() + ApiPath.forgotPassword(), {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify( this.formData,)
      })
        .then((response: Response) => this.requestSuccessful(response))
        .catch((error: Response) => this.requestError(error))
    },
    async requestSuccessful(response: Response) {
      const responseClone = response.clone()
      const json = await response.json()
      if (json?.error) {
        this.requestFailed(responseClone)
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
    async requestFailed(response: Response) {
      const json = await response.json()
      this.processFailedSignin(json?.error)
    },
    async requestError(response: Response) {
      const json = await response.json()
      this.processFailedSignin(json?.data.error)
    },
    processFailedSignin(errorText: string | null | undefined) {
      if (errorText) {
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: errorText },
        })
      }
    },
    checkSignedIn() {
      if (this.signedIn) {
        this.$router.replace({ name: this.$routerExtension.names.Home })
      }
    },
  },
})
</script>
