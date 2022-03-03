<template>
  <!-- {{person}} -->
  <div class="text-center" style="text-align:center;max-width:400px;margin: auto">
    <InputText id="name"
       aria-describedby="name-help"
       type="text"
       v-model="person.name"
       class="p-d-block p-mx-auto"
       autocomplete="off"
      />
      <Button label="Save" @click="handleClick" />
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


  const handleClick = async () => {
    const { data } = await axios.post('/api/person', person);
    console.log("post", data);
  };


</script>
