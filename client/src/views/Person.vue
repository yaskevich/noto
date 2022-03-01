<template>

  <div class="text-center" style="text-align:center;max-width:400px;margin: auto">
    {{person}}
  </div>

</template>

<script setup lang="ts">

  import { ref, reactive, onBeforeMount } from 'vue';
  import axios from 'axios';
  import { useRoute } from 'vue-router';
  const person = reactive({});

  const vuerouter = useRoute();
  const id = vuerouter.params.id;
  console.log('person id', id);
  // import router from '../router';

  onBeforeMount(async () => {
    const config = {};
    config['params'] = { id: id };
    const { data } = await axios.get('/api/person', config);
    console.log(data);
    Object.assign(person, data);
  });

</script>
