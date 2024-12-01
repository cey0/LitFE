<!-- layouts/default.vue -->
<template>
    <div class="flex">
      <AppSidebar />
      <div class="ml-20 flex-grow">
        <slot />
      </div>
    </div>
  </template>
  
  <script setup>
  import AppSidebar from "@/components/AppSidebar.vue";
  </script>
  
  <style scoped>
  .ml-20 {
    margin-left: 5rem;
  }
  
  .flex {
    display: flex;
  }
  
  .flex-grow {
    flex-grow: 1;
  }
  </style>