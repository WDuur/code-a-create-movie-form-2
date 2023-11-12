<script setup>
import { computed, reactive } from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "cancel"]);

const errors = reactive({
  name: null,
  description: null,
  image: null,
  inTheaters: null,
  genres: null,
});

const genres = reactive([
  { text: "Drama", value: "Drama" },
  { text: "Crime", value: "Crime" },
  { text: "Action", value: "Action" },
  { text: "Comedy", value: "Comedy" },
]);

// form  validation
const validations = reactive({
  name: "required",
  genres: "required",
});

const validationRules = (rule) => {
  if (rule === "required") return /^ *$/;

  return null;
};
const clearErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = null;
  });
};

const validate = () => {
  let valid = true;
  clearErrors();
  for (const [field, rule] of Object.entries(validations)) {
    const validation = validationRules(rule);
    if (validation) {
      if (validation.test(props.modelValue[field] || "")) {
        errors[field] = `${field} is ${rule}`;
        valid = false;
      }
    }
  }

  return valid;
};

const submitMovie = () => {
  if (validate()) {
    emit("update:modelValue");
    clearErrors();
  }
};

const cancelForm = () => {
  emit("cancel");
  clearErrors();
};

const notRated = computed(() => !props.movie.rating);
</script>

<template>
  <div class="modal-wrapper text-black">
    <div class="modal-wrapper-inner">
      <form @submit.prevent="submitMovie">
        <div class="movie-form-input-wrapper">
          <label for="name">Name </label>
          <input
            type="text"
            name="name"
            id="name"
            v-model="modelValue.name"
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
            v-model="modelValue.description"
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
            v-model="modelValue.image"
            class="movie-form-input"
          />
          <span class="movie-form-error">{{ errors.image }}</span>
        </div>
        <div class="movie-form-input-wrapper">
          <label for="genre">Genres</label>
          <select
            name="genre"
            id="genre"
            v-model="modelValue.genres"
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
        <div class="movie-form-input-wrapper">
          <label for="inTheaters" class="movie-form-checkbox-label">
            <input
              type="checkbox"
              id="inTheaters"
              v-model="modelValue.inTheaters"
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
          <button type="button" class="button" @click="cancel()">Cancel</button>

          <button type="submit" class="button-primary">
            {{ modelValue.id ? "Update" : "Create" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
