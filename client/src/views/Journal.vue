<template>
    <div class="card flex justify-center">
        <Select v-model="selectedNumber" :options="range" placeholder="range" class="w-full md:w-56" style="max-width: 7rem;" />
    </div>
  <div class="dates">
    <div v-for="offset in [...Array(selectedNumber).keys()]">{{getDate(offset)}}</div>

  </div>
  <div class="text-center">
    <Unit :categories="cats" v-for="entry in posts" :post="entry" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onBeforeMount } from 'vue';
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
      const atime = a.stamped ? (Number.isInteger(a.time) ? (new Date(a.time)).toISOString() : a.time) : a.alarm;
      const btime = b.stamped ? (Number.isInteger(b.time) ? (new Date(b.time)).toISOString() : b.time) : b.alarm;
      return btime.localeCompare(atime);
    })
  );
});

const getDate = (num) => {
  const date = new Date();
  date.setDate(date.getDate() - num);
  return date.toString().split(' ').slice(0, 3).join(' ');
};

const range = ref([10, 30, 50, 100]);
const selectedNumber = ref(10);
</script>