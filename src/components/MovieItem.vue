<script setup>
import { computed } from "vue";
import MovieStarRating from "./MovieStarRating.vue";
import {
  StarIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
} from "@heroicons/vue/24/solid";

const props = defineProps({
  movie: {
    type: Array,
    required: true,
  },
});
defineEmits(["remove", "edit", "update:rating"]);

const notRated = computed(() => !props.movie.rating);
</script>

<template>
  <section class="movie-item text-black">
    <div class="movie-item-image-wrapper">
      <MovieStarRating :rating="movie.rating" />
      <img :src="movie.image" class="movie-item-image" alt="" />
    </div>

    <div class="movie-item-content-wrapper">
      <div class="movie-item-title-wrapper">
        <h3 class="movie-item-title">{{ movie.name }}</h3>
        <div class="movie-item-genres-wrapper">
          <span
            v-for="genre in movie.genres"
            :key="`${movie.id}-${genre}`"
            class="movie-item-genre-tag"
            >{{ genre }}</span
          >
        </div>
      </div>
      <div class="movie-item-description-wrapper">
        <p class="movie-item-description">{{ movie.description }}</p>
      </div>
      <div class="movie-item-rating-wrapper">
        <span class="movie-item-rating-text">
          Rating: ({{ movie.rating }}/5)
        </span>

        <div class="movie-item-star-icon-wrapper">
          <button
            v-for="star in 5"
            :key="star"
            class="movie-item-star-icon-button"
            :class="[
              star <= movie.rating ? 'text-yellow-500' : 'text-gray-500',
            ]"
            :disabled="star === movie.rating"
            @click="$emit('update:rating', { id: movie.id, rating: star })"
          >
            <StarIcon class="movie-item-star-icon" />
          </button>
        </div>
        <div class="movie-item-icon-wrapper">
          <PencilIcon
            class="movie-item-icons"
            @click="$emit('edit', movie.id)"
          />
        </div>
        <div class="movie-item-icon-wrapper danger">
          <TrashIcon
            class="movie-item-icons"
            @click="$emit('remove', movie.id)"
          />
        </div>
        <RouterLink
          :to="{ name: 'movie-detail', params: { id: movie.id } }"
          class="movie-item-icon-wrapper danger"
        >
          <EyeIcon
            class="movie-item-icons"
            @click="$emit('remove', movie.id)"
          />
        </RouterLink>
      </div>
    </div>
  </section>
</template>
