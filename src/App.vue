<script setup>
import { RouterView } from "vue-router";
import { useRoute } from "vue-router";

const route = useRoute();
console.log(route);
</script>
<template>
  <div class="home">
    <h1>{{ route.meta.title }}</h1>
    <RouterView />
  </div>
</template>
