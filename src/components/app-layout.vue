<template>
  <app-header />

  <!--  <flash></flash>-->
  <!--  <% flash.keys.each do |type| %>-->
  <!--  <div class="flash <%= type %>">-->
  <!--    <% Array.wrap(flash[type]).each do |e| %>-->
  <!--    <p><%= e %></p>-->
  <!--    <% end %>-->
  <!--  </div>-->
  <!--  <% end %>-->

  <recipes-index />

  <footer>
    <div>
      Recipe image placeholder icon <a href="http://www.freepik.com" title="Freepik">Freepik</a> from
      <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by
      <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0
        BY</a>
    </div>
  </footer>
</template>

<script>
import AppHeader from '~/components/app-header'
import RecipesIndex from '~/components/recipes/index'

export default {
  components: {
    AppHeader,
    RecipesIndex,
  },
}
</script>
