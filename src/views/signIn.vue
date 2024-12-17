<template>
  <form
    class="max-w-screen-xs w-full self-center pt-4 px-2"
    @submit.prevent="signin"
  >
    <section class="w-full flex flex-col">
      <h2 class="text-2xl border-b border-gray-400 mb-2">
        Sign In
      </h2>
      <dl class="mt-2">
        <dt><label for="email">Email</label></dt>
        <dd>
          <a-input
            id="email"
            v-model="formData.email"
            type="text"
            name="email"
          />
        </dd>
      </dl>
      <dl class="mt-2">
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
      <input
        class="btn"
        type="submit"
        value="Sign In"
      >
      <!-- <forgot-password-link /> -->
    </section>
  </form>
</template>

<script lang="ts">
// import ForgotPasswordLink from '@/forgot-password-link.vue'
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import { StoreModulePath } from '~/store'
import { FlashActionTypes } from '~/store/modules/flash'
import { SessionActionTypes } from '~/store/modules/sessions/actions'
import { SessionGetterTypes } from '~/store/modules/sessions/getters'

export default defineComponent({
  name: 'SignIn',
  components: {
    // ForgotPasswordLink,
  },
  data() {
    return {
      formData: {
        email: this.$router.currentRoute.value.params.email,
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
    async signin() {
      this.$store.dispatch(StoreModulePath.Session + SessionActionTypes.CREATE, this.formData)
        .then((response) => this.signinSuccessful(response))
        .catch((error) => this.signinFailed(error))
    },
    signinSuccessful(response: Response) {
      if (!this.signedIn) {
        this.signinFailed(response)
        return
      }
      this.$routerExtension.replace({ name: this.$routerExtension.names.Home })
    },
    async signinFailed(response: Response) {
      const json = await response.json()
      const errors = [json.error]
      const fieldError = json['field-error']
      if (fieldError) {
        errors.push(`${fieldError[0]}: ${fieldError[1]}`)
      }
      this.processFailedSignin(errors)
    },
    processFailedSignin(errorText: string | string[] | null | undefined) {
      if (errorText) {
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: errorText },
        })
      }
      // this.$store.commit(StoreModulePath.Session + SessionMutationTypes.SIGN_OUT)
    },
    checkSignedIn() {
      if (this.signedIn) {
        this.$router.replace({ name: this.$routerExtension.names.Home })
      }
    },
  },
})
</script>
