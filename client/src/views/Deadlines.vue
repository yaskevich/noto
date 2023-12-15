<template>
  <div class="text-center">
    <!-- <h1>My Calendar</h1> -->
    <Toast />
    <calendar-view :show-date="showDate" class="mb-2 theme-default holiday-us-traditional holiday-us-official"
      @click-date="onClickDay" :items="items">
      <template #header="{ headerProps }">
        <calendar-view-header :header-props="headerProps" @input="setShowDate" />
      </template>

      <template #item="{ value, week, top }">
        <!-- span1 -->
        <div style="top: 20px; border:none;background-color: transparent; color: red;cursor: pointer;"
          :title="value.title"
          :class="value.classes.filter((x: string) => x !== 'span1').join(' ') + ' cv-item ml-' + (value.itemRow ? value.itemRow + 1 : 0)"
          @click="onClickEvent(value)">●</div>
      </template>
    </calendar-view>
    <Unit v-for="entry in posts" :categories="cats" :post="entry" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import helpers from '../helpers';
import Unit from './Unit.vue';
import { CalendarView, CalendarViewHeader } from "vue-simple-calendar"
import "../../node_modules/vue-simple-calendar/dist/style.css"
// The next two lines are optional themes
// import "~vue-simple-calendar/dist/css/default.css"
// import "~vue-simple-calendar/dist/css/holidays-us.css"
const toast = useToast();
const showDate = ref(new Date());
const setShowDate = (d: any) => showDate.value = d;
const posts = reactive([] as Array<IPost>);
const items = reactive([]);
const cats = reactive([] as Array<ICat>);

const onClickEvent = (val: any) => {
  console.log(val);
  console.log(val.title, val.originalItem?.content, val.startDate);

};

const onClickDay = (date: any, calendarItems: any, windowEvent: Event) => {
  console.log(date, calendarItems);
  
  for (let item of calendarItems) {
    console.log(item);
    
    toast.add({ severity: 'info', summary: helpers.renderDate(item.originalItem.alarm), detail: item.title, life: 3000 });
  }
  // this.selectionStart = null
  // this.selectionEnd = null
  // this.message = `You clicked: ${d.toLocaleDateString()}`
};

onBeforeMount(async () => {
  const { data } = await axios.get('/api/deadlines');
  // console.log(data);
  Object.assign(
    posts,
    data?.sort((a: any, b: any) => a.alarm.localeCompare(b.alarm))
  );
  // console.log(posts);
  Object.assign(items, data.map((x: any) => ({ ...x, startDate: x.alarm, endDate: x.alarm, tooltip: x.content })))

  const res = await axios.get('/api/cats');
  Object.assign(
    cats,
    res.data
  );
});
</script>

<style>
.cv-item {
  /* border: 2px solid red; */
  border: none;
  /* background-color: rgba(255, 182, 193, 0.475); */
}

.today {
  /* border: 2px solid red; */
  background-color: rgba(255, 182, 193, 0.496);
}
</style>

