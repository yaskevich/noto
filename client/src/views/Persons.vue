<template>

  <div class="text-center" style="text-align:center;max-width:400px;margin: auto">
    <h3>Persons</h3>
    <div v-for="(item, key) in persons"
         class="shadow-11 item p-2 mb-3 text-left"
         style="border: 1px dashed black;margin:0 auto;"
         :key="key"
         :title="item.name">
         <div class="title">{{item.name}}</div>
         <div class="title">{{item.bday}}</div>
         <div class="title">{{item.content}}</div>
         <!-- <div v-if="item.content" v-html="html(item.content)" class="content"></div> -->
    </div>
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
