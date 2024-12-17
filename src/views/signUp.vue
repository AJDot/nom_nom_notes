<template>
  <form
    class="max-w-screen-xs w-full self-center pt-4 px-2"
    @submit.prevent="signup"
  >
    <section class="w-full flex flex-col">
      <h2 class="text-2xl border-b border-gray-400 mb-2">
        Sign Up
      </h2>
      <dl class="mt-2">
        <dt>
          <label for="email">Email</label>
        </dt>
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
        <dt>
          <label for="username">Username</label>
        </dt>
        <dd>
          <a-input
            id="username"
            v-model="formData.username"
            type="text"
            name="username"
          />
        </dd>
      </dl>
      <dl class="mt-2">
        <dt>
          <label for="password">Password</label>
        </dt>
        <dd>
          <a-input
            id="password"
            v-model="formData.password"
            type="password"
            name="password"
          />
        </dd>
      </dl>
      <dl class="mt-2">
        <dt>
          <label for="password_confirmation">Confirm Password</label>
        </dt>
        <dd>
          <a-input
            id="password_confirmation"
            v-model="formData.passwordConfirmation"
            type="password"
            name="password_confirmation"
          />
        </dd>
      </dl>
      <input
        class="btn"
        type="submit"
        value="Sign Up"
      >
      <forgot-password-link />
    </section>
  </form>
</template>

<script lang="ts">
// import ForgotPasswordLink from '@/forgot-password-link.vue'
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import { StoreModulePath } from '~/store'
import { FlashActionTypes } from '~/store/modules/flash'
import { SessionGetterTypes } from '~/store/modules/sessions/getters'
import { SignupActionTypes } from '~/store/modules/signups/actions'

export default defineComponent({
  name: 'SignUp',
  components: {
    // ForgotPasswordLink,
  },
  data() {
    return {
      formData: {
        email: null,
        username: null,
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
  computed: {
    ...mapGetters('sessions', { signedIn: SessionGetterTypes.SIGNED_IN }),
  },
  methods: {
    signup() {
      this.$store.dispatch(StoreModulePath.Signup + SignupActionTypes.CREATE, this.formData)
        .then((response) => this.signupSuccessful(response))
        .catch((error) => this.signupError(error))
    },
    signupSuccessful(response: Response) {
      if (!this.signedIn) {
        this.signupFailed(response)
        return
      }
      this.$router.replace({ name: this.$routerExtension.names.Home })
    },
    async signupFailed(response: Response) {
      const json = await response.json()
      const errors = [json.error]
      const fieldError = json['field-error']
      if (fieldError) {
        errors.push(`${fieldError[0]}: ${fieldError[1]}`)
      }
      this.processFailedSignup(errors)
    },
    signupError(error: Error) {
      const errorText = error.message || 'There was an error creating your account'
      this.processFailedSignup(errorText)
    },
    processFailedSignup(errorText: string | string[] | null | undefined) {
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
