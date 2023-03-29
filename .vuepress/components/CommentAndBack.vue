<template>
  <p>
    <span v-if="url">
      <a :href="url">Comment On Hacker News</a>
      |
    </span>
    <a href="\">Back to Home :)</a>
  </p>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  url: {
    type: String,
    required: true,
  },
});
</script>
