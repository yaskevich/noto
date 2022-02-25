<template>

  <div class="text-center" style="text-align:center;max-width:400px;margin: auto">
    <h3>Persons</h3>
  </div>

</template>

<script setup lang="ts">

  import { ref, reactive, onBeforeMount } from 'vue';
  import axios from 'axios';

  const persons = reactive([]);
  onBeforeMount(async () => {
    const { data } = await axios.get('/api/persons');
    console.log(data);
    Object.assign(persons, data);
  });

</script>
