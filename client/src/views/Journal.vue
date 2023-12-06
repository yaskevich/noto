<template>
  <div class="text-center">
    <Unit v-for="entry in posts" :post="entry" />
  </div>
</template>
  
<script setup lang="ts">
import { reactive, onBeforeMount } from 'vue';
import axios from 'axios';
import Unit from './Unit.vue';

const posts = reactive([] as Array<IPost>);

onBeforeMount(async () => {
  const { data } = await axios.get('/api/dated');
  // console.log(data);
  Object.assign(
    posts,
    data?.sort((a: any, b: any) => {
      const atime = a.stamped ? a.time : a.date;
      const btime = b.stamped ? b.time : b.date;
      return btime.localeCompare(atime);
    })
  );
  // console.log(posts);
});
</script>
  