<template>
  <header class="app-header">
    <div class="primary-header row">
      <h1 class="row">
        <a href="/" aria-label="Go to Nom Nom Notes Home">
          <!--        <a href="/" aria-label="Go to <%= context_dig('app.header.title') %> Home">-->
          <img src="~Public/logo-512x512.png" alt="Nom Nom Notes" class="logo-n3">
          <!--          <img src="/logo-512x512.png" alt="<%= context_dig('app.header.title') %>" class="logo-n3">-->
          <!--          <% if %w[/ /sign_in /sign_up].include?(request.path_info) %>-->
          <!--          <span><%= context_dig('app.header.title') %></span>-->
          <!--          <% end %>-->
        </a>
      </h1>
      <ul class="suffix s-200-em horizontal j-slash">
        <!--        <% if current_user.blank? %>-->
        <!--        <% if request.path_info != '/sign_in' %>-->
        <li v-if="!signedIn">
          <router-link :to="{name: RouteName.SignIn}">Sign In</router-link>
        </li>
        <!--        <% end %>-->
        <!--        <% if request.path_info != '/sign_up' %>-->
        <li v-if="!signedIn">
          <router-link :to="{name: RouteName.SignUp}">Sign Up</router-link>
        </li>
        <!--        <% end %>-->
        <!--        <% end %>-->
        <!--        <% if current_user.present? %>-->
        <li v-if="signedIn">
          <a href="#" @click.prevent="signOut">Sign Out</a>
        </li>
        <!--        <% end %>-->
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
import { RouteName } from '~/router/routeName'
import { FlashActionTypes } from '~/store/modules/flash'
import RoutePath from '~/router/path'

export default defineComponent({
  components: { Flash },
  setup(props, context) {
    return {
      RouteName,
    }
  },
  computed: {
    ...mapState('sessions', { signedIn: 'signedIn' }),
  },
  methods: {
    setError(error, text): void {
      const errorText = (error.response && error.response.data && error.response.data.error) || text
      if (errorText) this.$store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, { flash: { alert: errorText } })
    },
    signOut(): void {
      this.$http.secured.delete(RoutePath.signin())
        .then(response => {
          this.$store.commit(StoreModulePath.Session + SessionMutationTypes.SIGN_OUT)
          this.$router.replace({ name: RouteName.Home })
        })
        .catch(error => this.setError(error, 'Cannot sign out'))
    },
  },
})
</script>
