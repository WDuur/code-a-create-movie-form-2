<script setup>
import { reactive, ref, computed } from "vue";
/*
 This is an Icon that you can use to represent the stars if you like
 otherwise you could just use a simple ⭐️ emoji, or * character.
*/
import { StarIcon, TrashIcon, PencilIcon } from "@heroicons/vue/24/solid";
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

const removeMovie = (movieIndex) => {
  movies.value.splice(movieIndex, 1);
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

const avargeRating = computed({
  get() {
    if (movies.value.length) {
      const total = movies.value.reduce((sum, movie) => sum + movie.rating, 0);
      return roundToTwoDecimalPlaces(total / movies.value.length);
    }
    return 0;
  },
});

const roundToTwoDecimalPlaces = (number) => {
  return parseFloat(number.toFixed(2));
};

const editMovie = (movieIndex) => {
  if (movieIndex >= 0 && movieIndex < movies.value.length) {
    const movie = movies.value[movieIndex];
    const updatedForm = { ...movie, index: movieIndex, edit: true };
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
    <div class="movie-list text-black">
      <div
        class="movie-item"
        v-for="(movie, movieIndex) in movies"
        :key="movie.id"
      >
        <div class="movie-item-image-wrapper">
          <div class="movie-item-star-wrapper">
            <StarIcon
              id="rating"
              class="movie-item-star-rating-icon"
              :class="[movie.rating ? 'text-yellow-500' : 'text-gray-500']"
            />
            <div class="movie-item-star-content-wrapper">
              <span
                v-if="movie.rating"
                id="rating-stars"
                class="movie-item-star-content-rating-rated"
              >
                {{ movie.rating }}
              </span>
              <span v-else class="movie-item-star-content-rating-not-rated">
                -
              </span>
            </div>
          </div>
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
                @click="updateRating(movieIndex, star)"
              >
                <StarIcon class="movie-item-star-icon" />
              </button>
            </div>
            <div class="movie-item-icon-wrapper">
              <PencilIcon
                class="movie-item-icons"
                @click="editMovie(movieIndex)"
              />
            </div>
            <div class="movie-item-icon-wrapper">
              <TrashIcon
                class="movie-item-icons"
                @click="removeMovie(movieIndex)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
