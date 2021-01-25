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
        <li v-if="!signedIn">
          <router-link :to="{ name: $routerExtension.names.SignIn, params: {originalRequest: $router.currentRoute.value.path} }">
            Sign In
          </router-link>
        </li>
        <li v-if="!signedIn">
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
import { mapState } from 'vuex'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import { StoreModulePath } from '~/store'
import Flash from '@/flash.vue'
import { FlashActionTypes } from '~/store/modules/flash'
import RoutePath from '~/router/path'
import { AxiosError } from 'axios'

export default defineComponent({
  components: { Flash },
  computed: {
    ...mapState('sessions', { signedIn: 'signedIn' }),
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
      this.$http.secured
        .delete(RoutePath.signin())
        .then((_response) => {
          this.$store.commit(
            StoreModulePath.Session + SessionMutationTypes.SIGN_OUT,
          )
          this.$router.replace({ name: this.$routerExtension.names.Home })
        })
        .catch((error) => this.setError(error, 'Cannot sign out'))
    },
  },
})
</script>
