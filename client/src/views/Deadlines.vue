<template>
  <div class="text-center">
    <!-- <h1>My Calendar</h1> -->
    <calendar-view :show-date="showDate" class="mb-2 theme-default holiday-us-traditional holiday-us-official"
      :items="items">
      <template #header="{ headerProps }">
        <calendar-view-header :header-props="headerProps" @input="setShowDate" />
      </template>
    </calendar-view>
    <Unit v-for="entry in posts" :post="entry" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue';
import axios from 'axios';
import helpers from '../helpers';
import Unit from './Unit.vue';
import { CalendarView, CalendarViewHeader } from "vue-simple-calendar"
import "../../node_modules/vue-simple-calendar/dist/style.css"
// The next two lines are optional themes
// import "~vue-simple-calendar/dist/css/default.css"
// import "~vue-simple-calendar/dist/css/holidays-us.css"

const showDate = ref(new Date());
const setShowDate = (d: any) => showDate.value = d;
const posts = reactive([] as Array<IPost>);
const items = reactive([]);

onBeforeMount(async () => {
  const { data } = await axios.get('/api/deadlines');
  // console.log(data);
  Object.assign(
    posts,
    data?.sort((a: any, b: any) => a.alarm.localeCompare(b.alarm))
  );
  // console.log(posts);
  Object.assign(items, data.map((x: any) => ({ ...x, startDate: x.alarm, endDate: x.alarm, tooltip: x.content })))
});
</script>

<style>
.cv-item {
  /* border: 2px solid red; */
  background-color: rgba(255, 182, 193, 0.475);
}
</style>

