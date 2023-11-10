<script setup>
import { reactive, ref, computed } from "vue";
/*
 This is an Icon that you can use to represent the stars if you like
 otherwise you could just use a simple ⭐️ emoji, or * character.
*/
import { StarIcon, TrashIcon, PencilIcon } from "@heroicons/vue/24/solid";
import MovieItem from "@/MovieItem.vue";
import { items } from "./movies.json";

const movies = ref(items);

const updateRating = (movieIndex, rating) => {
  movies.value[movieIndex].rating = rating;
};

const removeRating = () => {
  movies.value.forEach((movie) => {
    movie.rating = 0;
  });
};

const errors = reactive({
  name: null,
  description: null,
  image: null,
  inTheaters: null,
  genres: null,
});
const form = reactive({
  name: null,
  description: null,
  image: null,
  inTheaters: false,
  genres: [],
});
const validations = reactive({
  name: "required",
  genres: "required",
});

const genres = reactive([
  { text: "Drama", value: "Drama" },
  { text: "Crime", value: "Crime" },
  { text: "Action", value: "Action" },
  { text: "Comedy", value: "Comedy" },
]);

const validationRules = (rule) => {
  if (rule === "required") return /^ *$/;

  return null;
};

const validate = () => {
  let valid = true;
  clearErrors();
  for (const [field, rule] of Object.entries(validations)) {
    const validation = validationRules(rule);
    if (validation) {
      if (validation.test(form[field] || "")) {
        errors[field] = `${field} is ${rule}`;
        valid = false;
      }
    }
  }

  return valid;
};

const addMovie = () => {
  if (validate()) {
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
  }
};

const updateMovie = (movieIndex) => {
  if (validate()) {
    const updatedMovie = {
      name: form.name,
      description: form.description,
      image: form.image,
      genres: form.genres,
      inTheaters: form.inTheaters,
      rating: form.rating,
    };
    movies.value[movieIndex] = updatedMovie;
    hideForm();
    console.log(movies);
  }
};

const removeMovie = (id) => {
  movies.value = movies.value.filter((movie) => movie.id !== id);
};

function cleanUpForm() {
  Object.keys(form).forEach((key) => {
    form[key] = null;
  });
  clearErrors();
}

const clearErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = null;
  });
};

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
    <div v-if="showMovieForm" class="modal-wrapper text-black">
      <div class="modal-wrapper-inner">
        <form @submit.prevent="addMovie">
          <div class="movie-form-input-wrapper">
            <label for="name">Name </label>
            <input
              type="text"
              name="name"
              id="name"
              v-model="form.name"
              class="movie-form-input"
            />
            <span class="movie-form-error">{{ errors.name }}</span>
          </div>
          <div class="movie-form-input-wrapper">
            <label for="description">Description</label>
            <textarea
              type="text"
              name="description"
              id="description"
              v-model="form.description"
              class="movie-form-textarea"
            />
            <span class="movie-form-error">{{ errors.description }}</span>
          </div>
          <div class="movie-form-input-wrapper">
            <label for="image">Image</label>
            <input
              type="text"
              name="image"
              id="image"
              v-model="form.image"
              class="movie-form-input"
            />
            <span class="movie-form-error">{{ errors.image }}</span>
          </div>
          <div class="movie-form-input-wrapper">
            <label for="genre">Genres</label>
            <select
              name="genre"
              id="genre"
              v-model="form.genres"
              class="movie-form-input"
              multiple
            >
              <option
                v-for="option in genres"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
            <span class="movie-form-error">
              {{ errors.genres }}
            </span>
          </div>
          <div class="hidden">
            <label for="name">Rating </label>
            <input
              type="text"
              name="rating"
              id="rating"
              v-model="form.rating"
              class="movie-form-input"
            />
          </div>
          <div class="movie-form-input-wrapper">
            <label for="inTheaters" class="movie-form-checkbox-label">
              <input
                type="checkbox"
                id="inTheaters"
                v-model="form.inTheaters"
                :true-value="true"
                :false-value="false"
                class="movie-form-checkbox"
              />
              <span>In theaters</span>
            </label>
            <span class="movie-form-error">
              {{ errors.inTheaters }}
            </span>
          </div>
          <div class="movie-form-actions-wrapper">
            <button type="button" class="button" @click="hideForm">
              Cancel
            </button>
            <button
              v-if="form.edit"
              type="button"
              class="button-primary"
              @click="updateMovie(form.index)"
            >
              Update
            </button>

            <button v-else type="submit" class="button-primary">Create</button>
          </div>
        </form>
      </div>
    </div>
    <!-- movie actions  -->
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
      />
    </div>
  </div>
</template>
