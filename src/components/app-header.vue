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
          <router-link :to="{name: 'new-session'}">Sign In</router-link>
        </li>
        <!--        <% end %>-->
        <!--        <% if request.path_info != '/sign_up' %>-->
        <li v-if="!signedIn">
          <router-link :to="{name: 'sign-up'}">Sign Up</router-link>
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
      <!--      <div class="header-links"><%== yield_content :header_links %></div>-->
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

export default defineComponent({
  components: { Flash },
  data() {
    return {
      error: null,
    }
  },
  computed: {
    ...mapState('sessions', { signedIn: 'signedIn' }),
    // signedIn(): boolean {
    //   return localStorage.signedIn
    // },
  },
  methods: {
    setError(error, text): void {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    signOut(): void {
      this.$http.secured.delete('/signin')
        .then(response => {
          this.$store.commit(StoreModulePath.Session + SessionMutationTypes.SIGN_OUT)
          this.$router.replace({ name: 'home' })
          this.error = null
        })
        .catch(error => this.setError(error, 'Cannot sign out'))
    },
  },
})
</script>
