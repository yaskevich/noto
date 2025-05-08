<template>
  <div class="card flex justify-center">
    <Select v-model="selectedNumber" :options="range" placeholder="range" class="w-full md:w-56"
      style="max-width: 7rem;" />
  </div>
  <div class="grid">
    <div class="col" v-for="day in weekdays">
      <div class="text-center p-3 border-round-sm bg-primary font-bold">{{ day }}</div>
    </div>
  </div>

  <div>
    <div class="grid" v-for="week in list">
      <div class="col" v-for="day in week">
        <div class="text-center p-3 border-round-sm bg-blue-200"> {{ day[2] }}
        </div>
      </div>
    </div>
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

const getDate = (num: number) => {
  const date = new Date();
  date.setDate(date.getDate() + num);
  return [...date.toString().split(' ').slice(0, 3), num];
};

const range = ref([28, 50, 100, 300]);
const selectedNumber = ref(28);

const daysForLocale = () => {
  const { format } = new Intl.DateTimeFormat(Intl.NumberFormat().resolvedOptions().locale, { weekday: "long" });
  return [...Array(7).keys()]
    .map((day) => format(new Date(Date.UTC(2021, 5, day))));
};

const weekdays = daysForLocale();
const order = (new Date()).getDay();
const daysToAdd = 6 - (order - 2);
const fwd = [...Array(daysToAdd).keys()].slice(1).map(x => getDate(x));
const bwd = [...Array(selectedNumber.value).keys()].map(x => getDate(-x));
const arr = fwd.reverse().concat(bwd);
const list = Array.from({ length: Math.ceil(arr.length / 7) }, (_, i) =>
  arr.slice(i * 7, i * 7 + 7).reverse()
);

</script>