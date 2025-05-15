<template>
  <div v-show="isLoaded">
    <div class="card flex justify-center">
      <Select v-model="selectedNumber" :options="range" placeholder="range" class="w-full md:w-56"
        @update:modelValue="change" style="max-width: 7rem;" />
      <ToggleSwitch v-model="checked" />
    </div>
    <div class="grid">
      <div class="col" v-for="day in weekdays">
        <div class="text-center p-3 border-round-sm bg-primary font-bold">{{ day }}</div>
      </div>
    </div>

    <div v-if="datesDone">
      <div class="grid" v-for="week in allDays">
        <div class="col" v-for="day in week">
          <Button severity="secondary" :class="'text-center p-3 border-round-sm ' + setRenderClass(day)"
            :label="`${day[2]} ${checked ? helpers.months[day[4]] : day[1]}`" :title="`${day[1]}`"
            @click="showEditor(day)" />
        </div>
      </div>
    </div>

    <div class="text-center">
      <Unit :categories="cats" v-for="entry in posts" :post="entry" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onBeforeMount, toRaw } from 'vue';
import axios from 'axios';
import Unit from './Unit.vue';
import helpers from '../helpers';
import router from '../router';

const posts = reactive([] as Array<IPost>);
const cats = reactive([] as Array<ICat>);
const order = (new Date()).getDay();
const range = ref([28, 70, 140, 350]);
const selectedNumber = ref(toRaw(range.value?.[0]));
const allDays = ref();
const datesDone = ref({} as keyable);
const isLoaded = ref(false);
const checked = ref(false);
const toDateArray = (date: Date, num = 0) => [...date.toString().split(' ').slice(0, 4), date.getMonth(), num];

const valToKey = (val: Array<number>) => `${val[3]}-${String(val[4] + 1).padStart(2, '0')}-${val[2]}`;

const setRenderClass = (val: Array<number>) => {
  if (!val[5]) {
    return 'bg-blue-400';
  }
  if (val[5] > 0) {
    return 'surface-50';
  }
  if (Object.keys(datesDone.value)?.includes(valToKey(val))) {
    return 'bg-green-300';
  }
  return 'bg-red-400';
};

const showEditor = (val: Array<number>) => {
  const datum = datesDone.value[valToKey(val)];
  if (datum?.id) {
    router.push(`/note/${datum.id}`);
  }
  console.log(datum);
};

onBeforeMount(async () => {
  const { data } = await axios.get('/api/dated');
  // console.log(data);
  const res = await axios.get('/api/cats');
  Object.assign(
    cats,
    res.data
  );

  const toKey = (val: IPost) => {
    const key = val?.alarm?.toString()?.slice(0, 10);
    // const arr = toDateArray(new Date(val.time));
    if (key) {
      datesDone.value[key] = val;
    }
  };

  data.filter((x: IPost) => x.time && x).map((x: IPost) => toKey(x));

  Object.assign(
    posts,
    data?.sort((a: any, b: any) => {
      const atime = a.stamped ? (Number.isInteger(a.time) ? (new Date(a.time)).toISOString() : a.time) : a.alarm;
      const btime = b.stamped ? (Number.isInteger(b.time) ? (new Date(b.time)).toISOString() : b.time) : b.alarm;
      return btime.localeCompare(atime);
    })
  );
  isLoaded.value = true;
});

const getDate = (num: number) => {
  const date = new Date();
  date.setDate(date.getDate() + num);
  return toDateArray(date, num);
};

const daysForLocale = () => {
  const { format } = new Intl.DateTimeFormat(Intl.NumberFormat().resolvedOptions().locale, { weekday: "long" });
  return [...Array(7).keys()]
    .map((day) => format(new Date(Date.UTC(2021, 5, day))));
};

const weekdays = daysForLocale();
const daysToAdd = 6 - (order - 2);
const fwd = [...Array(daysToAdd).keys()].slice(1).map(x => getDate(x));

const makeList = () => {
  const bwd = [...Array(selectedNumber.value + order).keys()].map(x => getDate(-x));
  const arr = fwd.reverse().concat(bwd);
  allDays.value = Array.from({ length: Math.ceil(arr.length / 7) }, (_, i) =>
    arr.slice(i * 7, i * 7 + 7).reverse()
  );
};

const change = () => {
  makeList();
};

makeList();
</script>
