<template>
  <header class="app-header">
    <div class="primary-header row">
      <h1 class="row">
        <router-link
          :to="{name: $routerExtension.names.Home}"
          aria-label="Go to Nom Nom Notes Home"
        >
          <img
            src="~Public/logo-512x512.png"
            alt="Nom Nom Notes"
            class="logo-n3"
          >
        </router-link>
      </h1>
      <ul class="suffix s-200-em horizontal j-slash">
        <li v-if="currentUser">
          {{ currentUser.username }}
        </li>
        <li v-if="canSignIn">
          <router-link
            :to="{ name: $routerExtension.names.SignIn, params: {originalRequest: $router.currentRoute.value.path} }"
          >
            Sign In
          </router-link>
        </li>
        <li v-if="canSignUp">
          <router-link :to="{ name: $routerExtension.names.SignUp }">
            Sign Up
          </router-link>
        </li>
        <li v-if="signedIn">
          <a
            href="#"
            @click.prevent="signOut"
          >Sign Out</a>
        </li>
      </ul>
    </div>
    <div class="secondary-header">
      <div class="header-links">
        <router-view name="secondary-header" />
      </div>
    </div>
    <flash />
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import { StoreModulePath } from '~/store'
import Flash from '@/flash.vue'
import { FlashActionTypes } from '~/store/modules/flash'
import { AxiosError, AxiosResponse } from 'axios'
import { SessionGetterTypes } from '~/store/modules/sessions/getters'
import { SessionActionTypes } from '~/store/modules/sessions/actions'
import { FeatureActionTypes } from '~/store/modules/features/actions'
import { FeatureName } from '~/enums/features'

export default defineComponent({
  components: { Flash },
  data() {
    return {
      FeatureName: FeatureName,
    }
  },
  computed: {
    ...mapGetters('sessions', { signedIn: SessionGetterTypes.SIGNED_IN }),
    canSignUp(): boolean {
      return this.$flipper.isEnabled(FeatureName.Signup) && !this.signedIn && !this.$routerExtension.currentRouteIs(this.$routerExtension.names.SignUp)
    },
    canSignIn(): boolean {
      return !this.signedIn && !this.$routerExtension.currentRouteIs(this.$routerExtension.names.SignIn)
    },
  },
  async beforeCreate() {
    this.$store.dispatch(StoreModulePath.Features + FeatureActionTypes.FETCH, { key: 'signup' })
  },
  methods: {
    setError(error: AxiosError, text: string): void {
      const errorText =
        (error.response && error.response.data && error.response.data.error) ||
        text
      if (errorText) {
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: errorText },
        })
      }
    },
    signOut(): void {
      this.$store.dispatch(StoreModulePath.Session + SessionActionTypes.DESTROY)
        .then((response: AxiosResponse) => this.signOutSuccessful(response))
        .catch((error: AxiosError) => this.signOutError(error))
    },
    signOutSuccessful(response: AxiosResponse) {
      if (this.signedIn) {
        this.signOutFailed(response)
        return
      }
      this.$routerExtension.replace({ name: this.$routerExtension.names.Home })
    },
    signOutFailed(error: AxiosResponse) {
      this.processFailedSignOut(error?.data?.error)
    },
    signOutError(error: AxiosError) {
      this.processFailedSignOut(error.response?.data.error || 'Cannot sign out')
    },
    processFailedSignOut(errorText: string | null | undefined) {
      if (errorText) {
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: errorText },
        })
      }
    },
  },
})
</script>
