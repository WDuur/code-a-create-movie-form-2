<script setup>
import { reactive, ref, computed } from "vue";
import MovieItem from "@/MovieItem.vue";
import MovieForm from "@/MovieForm.vue";
import { items } from "./movies.json";

const movies = ref(items);

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

const form = reactive({
  name: null,
  description: null,
  image: null,
  inTheaters: false,
  genres: [],
});

const submit = () => {
  if (form.id) {
    updateMovie(form.id);
  } else {
    addMovie();
  }
};
const addMovie = () => {
  const movie = {
    id: Number(Date.now()),
    name: form.name,
    description: form.description,
    image: form.image,
    genres: form.genres,
    inTheaters: form.inTheaters,
    rating: null,
  };
  movies.value.push(movie);
  hideForm();
};

const updateMovie = (id) => {
  const movie = movies.value.find((movie) => movie.id === id);
  if (movie.id === id) {
    movie.name = form.name;
    movie.description = form.description;
    movie.image = form.image;
    movie.genres = form.genres;
    movie.inTheaters = form.inTheaters;
    hideForm();
  }
};

const removeMovie = (id) => {
  movies.value = movies.value.filter((movie) => movie.id !== id);
};

function cleanUpForm() {
  Object.keys(form).forEach((key) => {
    form[key] = null;
  });
}

const showMovieForm = ref(false);

const hideForm = () => {
  showMovieForm.value = false;
  cleanUpForm();
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

const editMovie = (id) => {
  const movieIndex = movies.value.findIndex((movie) => movie.id === id);

  if (movieIndex !== -1) {
    const movie = movies.value[movieIndex];
    const updatedForm = { ...movie };
    showForm();

    Object.assign(form, updatedForm);
  }
};
</script>

<template>
  <div class="app">
    <!-- Movie Form -->
    <MovieForm
      v-if="showMovieForm"
      class="modal-wrapper text-black"
      v-model="form"
      @update:modelValue="submit"
      @cancel="hideForm"
    />

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
