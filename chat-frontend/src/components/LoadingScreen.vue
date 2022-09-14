<template>
  <div class="flex items-center justify-center bg-transparent z-20">
    <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-gray-400 my-96"
         role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "LoadingScreen"
}
</script>