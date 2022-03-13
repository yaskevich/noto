<template>

  <div class="text-center" style="text-align:center;max-width:400px;margin: auto">
    <div v-for="(item, key) in posts"
         class="shadow-11 item p-2 mb-3 text-left"
         style="border: 1px dashed black;margin:0 auto;"
         :key="key"
         :title="helpers.renderDate(item?.time)">
      <div v-if="item.date" style="color:red;font-weight:bold;">{{helpers.renderDate(item?.date)}}</div>
      <span class="title">{{item.title}}</span>

      <div v-if="item.content" v-html="helpers.html(item.content)" class="content"></div>
    </div>
  </div>

</template>

<script setup lang="ts">

  import { ref, reactive, onBeforeMount } from 'vue';
  import axios from 'axios';
  import helpers from '../helpers';

  interface IItem {
    title: string;
    year: string;
    meta: string;
    type: string;
  }

  const posts = reactive([]);

  onBeforeMount(async () => {
    const { data } = await axios.get('/api/deadlines');
    console.log(data);
    Object.assign(posts, data?.sort((a, b) => b.time - a.time).reverse());
    console.log(posts);
  });



</script>
