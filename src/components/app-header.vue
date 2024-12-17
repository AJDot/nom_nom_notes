<template>
  <header>
    <div class="px-4 py-2 flex flex-col xs:flex-row items-center justify-between">
      <h1>
        <router-link
          :to="{ name: $routerExtension.names.Home }"
          aria-label="Go to Nom Nom Notes Home"
          class="inline-block align-middle"
        >
          <img
            src="/logo-512x512.png"
            alt="Nom Nom Notes"
            class="h-20 w-20"
          >
        </router-link>
        <span class="hidden ml-5 text-2xl align-middle sm:text-4xl xs:inline-block">Nom Nom Notes</span>
      </h1>
      <ul class="text-2xl j-slash sm:text-3xl">
        <li
          v-if="canViewShoppingList"
          class="inline-block"
        >
          <router-link :to="{ name: $routerExtension.names.ShoppingList }">
            Shopping List
          </router-link>
        </li>
        <li
          v-if="currentUser"
          class="inline-block"
        >
          {{ currentUser.username }}
        </li>
        <li
          v-if="canSignIn"
          class="inline-block"
        >
          <router-link :to="{ name: $routerExtension.names.SignIn, params: { originalRequest: $router.currentRoute.value.path } }">
            Sign In
          </router-link>
        </li>
        <li
          v-if="canSignUp"
          class="inline-block"
        >
          <router-link :to="{ name: $routerExtension.names.SignUp }">
            Sign Up
          </router-link>
        </li>
        <li
          v-if="signedIn"
          class="inline-block"
        >
          <a
            href="#"
            @click.prevent="signOut"
          >Sign Out</a>
        </li>
      </ul>
    </div>
    <div class="px-4 py-2">
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
import { SessionGetterTypes } from '~/store/modules/sessions/getters'
import { SessionActionTypes } from '~/store/modules/sessions/actions'
import { FeatureActionTypes } from '~/store/modules/features/actions'
import { FeatureName } from '~/enums/features'

export default defineComponent({
  components: { Flash },
  data() {
    return {
      FeatureName,
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
    canViewShoppingList(): boolean {
      return [this.$routerExtension.names.SignIn, this.$routerExtension.names.SignUp, this.$routerExtension.names.ShoppingList, this.$routerExtension.names.EditShoppingList].every(route => !this.$routerExtension.currentRouteIs(route))
    },
  },
  async beforeCreate() {
    this.$store.dispatch(StoreModulePath.Features + FeatureActionTypes.FETCH, { key: 'signup' })
  },
  methods: {
    signOut(): void {
      this.$store.dispatch(StoreModulePath.Session + SessionActionTypes.DESTROY)
        .then((response: Response) => this.signOutSuccessful(response))
        .catch((response: Response) => this.signOutFailed(response))
    },
    signOutSuccessful(response: Response) {
      if (this.signedIn) {
        this.signOutFailed(response)
        return
      }
      this.$routerExtension.replace({ name: this.$routerExtension.names.Home })
    },
    async signOutFailed(response: Response) {
      const json = await response.json()
      const errors = [json.error]
      this.processFailedSignOut(errors)
    },
    processFailedSignOut(errorText: string | string[] | null | undefined) {
      if (errorText) {
        this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
          flash: { alert: errorText },
        })
      }
    },
  },
})
</script>
