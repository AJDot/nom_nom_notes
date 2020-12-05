<template>
  <form class="sign_in" @submit.prevent="signin">
    <h2>Sign In</h2>
    <dl class="email">
      <dt><label for="email">Email</label></dt>
      <dd>
        <input v-model="formData.email" type="text" name="email" id="email" />
      </dd>
    </dl>
    <dl class="password">
      <dt><label for="password">Password</label></dt>
      <dd>
        <input v-model="formData.password" type="password" name="password" id="password" />
      </dd>
    </dl>
    <input class="btn" type="submit" value="Sign In" />
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useLoading } from '~/mixins/loading'
import { StoreModuleTypes } from '~/store'
import { SessionActionTypes } from '~/store/modules/sessions/actions'

export default defineComponent({
  name: "sign-in",
  setup(props, context) {
    const { loads, loading } = useLoading()
    return {
      loads,
      loading: loading,
    }
  },
  data() {
    return {
      formData: {
        email: null,
        password: null,
      },
    }
  },
  created() {
    this.checkSignedIn()
  },
  updated() {
    this.checkSignedIn()
  },
  methods: {
    // submit() {
    // this.loading('my thing', () => {
    // this.$store.dispatch(StoreModuleTypes.Session + SessionActionTypes.CREATE)
    // })
    // },
    signin() {
      this.$http.plain.post('/signin', { ...this.formData })
        .then(response => this.signinSuccessful(response))
        .catch(error => this.signinFailed(error))
    },
    signinSuccessful(response) {
      if (!response.data.csrf) {
        this.signinFailed(response)
        return
      }
      localStorage.csrf = response.data.csrf
      localStorage.signedIn = true
      this.error = ''
      this.$router.replace({name: "home"})
    },
    signinFailed(error) {
      this.error = (error.response && error.response.data && error.response.data.error) || ''
      delete localStorage.csrf
      delete localStorage.signedIn
    },
    checkSignedIn() {
      if (localStorage.signedIn) {
        this.$router.replace({name: "home"})
      }
    },
  },
})
</script>
