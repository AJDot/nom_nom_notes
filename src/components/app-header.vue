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
        <li>
          <router-link :to="{name: 'new-session'}">Sign In</router-link>
        </li>
        <!--        <% end %>-->
        <!--        <% if request.path_info != '/sign_up' %>-->
        <li>
          <a href="/sign_up">Sign Up</a>
        </li>
        <!--        <% end %>-->
        <!--        <% end %>-->
        <!--        <% if current_user.present? %>-->
        <li>
          <a href="/sign_out">Sign Out</a>
        </li>
        <!--        <% end %>-->
      </ul>
    </div>
    <div class="secondary-header">
      <!--      <div class="header-links"><%== yield_content :header_links %></div>-->
    </div>
  </header>
</template>

<script lang="ts">
export default {}
</script>
