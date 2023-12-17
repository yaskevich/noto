<template>
  <div class="text-center">
    <Unit :categories="cats" v-for="entry in posts" :post="entry" />
  </div>
</template>
  
<script setup lang="ts">
import { reactive, onBeforeMount } from 'vue';
import axios from 'axios';
import Unit from './Unit.vue';

const posts = reactive([] as Array<IPost>);
const cats = reactive([] as Array<ICat>);

onBeforeMount(async () => {
  const { data } = await axios.get('/api/dated');
  // console.log(data);
  const res = await axios.get('/api/cats');
  Object.assign(
    cats,
    res.data
  );
  Object.assign(
    posts,
    data?.sort((a: any, b: any) => {
      const atime = a.stamped ? a.time : a.alarm;
      const btime = b.stamped ? b.time : b.alarm;
      return btime.localeCompare(atime);
    })
  );
  // console.log(posts);
});
</script>
  