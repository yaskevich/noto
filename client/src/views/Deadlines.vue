<template>
  <div class="text-center">
    <Unit v-for="entry in posts" :post="entry" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue';
import axios from 'axios';
import helpers from '../helpers';
import Unit from './Unit.vue';

const posts = reactive([] as Array<IPost>);

onBeforeMount(async () => {
  const { data } = await axios.get('/api/deadlines');
  // console.log(data);
  Object.assign(
    posts,
    data?.sort((a: any, b: any) => a.alarm.localeCompare(b.alarm))
  );
  // console.log(posts);
});
</script>
