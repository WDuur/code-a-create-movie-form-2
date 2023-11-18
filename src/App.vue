<script setup>
import { ref, computed, defineAsyncComponent } from "vue";
import MovieItem from "@/MovieItem.vue";
import { items } from "./movies.json";

const AppModal = defineAsyncComponent(() => import("./AppModal.vue"));
const MovieForm = defineAsyncComponent(() => import("./MovieForm.vue"));

const showMovieForm = ref(false);
const movies = ref(items);
const currentMovie = ref();

const editMovie = (id) => {
  currentMovie.value = movies.value.find((movie) => movie.id === id);
  showForm();
};

const updateRating = ({ id, rating }) => {
  const movie = movies.value.find((movie) => movie.id === id);
  if (movie) {
    movie.rating = rating;
  }
};

const removeRating = () => {
  movies.value.forEach((movie) => {
    movie.rating = 0;
  });
};

const saveMovie = (data) => {
  const isExistingMovie = !!movies.value.find((movie) => movie.id === data.id);
  if (isExistingMovie) {
    updateMovie(data);
  } else {
    addMovie(data);
  }
};
const addMovie = (data) => {
  console.log(data);
  movies.value.push(data);
  hideForm();
};

const updateMovie = (data) => {
  console.log(data);
  movies.value = movies.value.map((movie) => {
    if (movie.id === data.id) {
      data.rating = movie.rating;
      return data;
    }
    return movie;
  });
  hideForm();
};

const removeMovie = (id) => {
  movies.value = movies.value.filter((movie) => movie.id !== id);
};
const hideForm = () => {
  showMovieForm.value = false;
  currentMovie.value = null;
};

const showForm = () => {
  showMovieForm.value = true;
};

const avargeRating = computed(() => {
  if (movies.value.length) {
    const total = movies.value.reduce((sum, movie) => sum + movie.rating, 0);
    return roundToTwoDecimalPlaces(total / movies.value.length);
  }
  return 0;
});

const roundToTwoDecimalPlaces = (number) => {
  return parseFloat(number.toFixed(2));
};
</script>

<template>
  <div class="app">
    <!-- Movie Form -->
    <AppModal v-if="showMovieForm" @close="hideForm" :title="'Add movie'">
      <MovieForm
        @update:modelValue="saveMovie"
        :modelValue="currentMovie"
        @cancel="hideForm"
      />
    </AppModal>
    <div class="movie-actions-list-wrapper">
      <div class="movie-actions-list-summary">
        Total Movies: {{ movies.length }} / Avarage Rating {{ avargeRating }}
      </div>
      <div class="movie-actions-list-actions">
        <button
          class="movie-actions-list-action-button"
          :class="{
            'button-primary': !showMovieForm,
            'button-disabled': showMovieForm,
          }"
          @click="removeRating"
          :disabled="showMovieForm"
        >
          Remove Ratings
        </button>
        <button
          class="movie-actions-list-action-button"
          :class="{
            'button-primary': !showMovieForm,
            'button-disabled': showMovieForm,
          }"
          @click="showForm"
          :disabled="showMovieForm"
        >
          Add Movie
        </button>
      </div>
    </div>
    <!-- movie list -->
    <div class="movie-list">
      <MovieItem
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @edit="editMovie"
        @remove="removeMovie"
        @update:rating="updateRating"
      />
    </div>
  </div>
</template>
