<template>
  <main v-if="organisation">
    <h1>{{ organisation.name }}</h1>
  </main>

  <main v-else>
    <h1>Organisation not found</h1>
  </main>
</template>

<script setup>
import { useData } from "vike-vue/useData";

const { organisation } = useData();
</script>
