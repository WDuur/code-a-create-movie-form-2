<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { items } from "@/data/movies.json";
import MovieStarRating from "@/components/MovieStarRating.vue";

const movie = ref(null);
const route = useRoute();

movie.value = items.find((item) => item.id === Number(route.params.id));
</script>

<template>
  <div
    class="container flex items-center max-w-6xl gap-4 p-10 m-auto dark:text-white"
  >
    <figure class="relative">
      <MovieStarRating :rating="movie.rating" class="absolute top-5 right-5" />
      <img :src="movie.image" :alt="movie.name" class="w-96" />
    </figure>

    <div>
      <h1 class="mb-4 text-5xl">{{ movie.name }}</h1>
      <div class="mb-3 movie-item-genres-wrapper">
        <span
          v-for="genre in movie.genres"
          :key="`${movie.id}-${genre}`"
          class="!text-lg movie-item-genre-tag"
          >{{ genre }}</span
        >
      </div>
      <p class="text-xl">{{ movie.description }}</p>
    </div>
  </div>
</template>
