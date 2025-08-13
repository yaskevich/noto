<template>
  <div class="text-center">
    <!-- <h1>My Calendar</h1> -->
    <Toast />
    <ToggleSwitch v-model="checked" />
    <calendar-view v-if="posts.length" :show-date="showDate"
      class="mb-2 theme-default holiday-us-traditional holiday-us-official" :startingDayOfWeek="1"
      @click-date="onClickDay" :items="(posts as any)">
      <template #header="{ headerProps }">
        <calendar-view-header :header-props="headerProps" @input="setShowDate" />
      </template>
      <template #item="{ value }">
        <!-- span1 -->
        <div :title="value.title"
          :class="value.classes.filter((x: string) => x !== 'span1').join(' ') + ' cv-item dot ml-' + (value.itemRow ? value.itemRow + 1 : 0)"
          @click="onClickEvent(value)">
          <component :is="renderMarker(value)" />
        </div>
      </template>
    </calendar-view>
    <Unit v-for="entry in posts" :categories="cats" :post="entry" />
  </div>

  <Dialog v-model:visible="visible" modal header="Save Note" :style="{ width: '25rem' }">
    <div>
      <div v-if="editor">
        <div class="mb-2">
          <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }">setLink</button>
          <button @click="editor?.chain().focus().unsetLink().run()" :disabled="!editor.isActive('link')">
            unsetLink
          </button>
        </div>
        <editor-content :editor="editor" class="editor" />
      </div>
      <div>
        <MultiSelect v-model="selTags" :options="tags" optionLabel="title" filter placeholder="Select tags"
          :maxSelectedLabels="3" class="w-full md:w-80" />
        <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
        <Button type="button" label="Save" @click="saveNote"></Button>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { h, ref, reactive, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import ToggleSwitch from 'primevue/toggleswitch';
import axios from 'axios';
import helpers from '../helpers';
import Unit from './Unit.vue';
import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar';
// import type { INormalizedCalendarItem, ICalendarItem } from 'vue-simple-calendar';
import { EditorContent } from '@tiptap/vue-3';
import "../../node_modules/vue-simple-calendar/dist/vue-simple-calendar.css";
// The next two lines are optional themes
// import "~vue-simple-calendar/dist/css/default.css"
// import "~vue-simple-calendar/dist/css/holidays-us.css"
const toast = useToast();
const showDate = ref(new Date());
const setShowDate = (d: any) => showDate.value = d;
const posts = reactive([] as Array<IPost>);
const cats = reactive([] as Array<ICat>);
const tags = reactive([] as Array<ICat>);
const checked = ref(true);
const visible = ref(false);
const thisPost = ref<IPost>();
const editor = helpers.setupEditor(thisPost?.value?.content || '');
const curDate = ref();
const selTags = ref();

const getLastMinute = () => {
  const dd = new Date(curDate.value.toISOString());
  dd.setHours(dd.getHours() + 23);
  dd.setMinutes(dd.getMinutes() + 59);
  dd.setSeconds(dd.getSeconds() + 59);
  return dd;
};

const renderMarker = (val: any) => {
  if (val.originalItem?.wholeday) {
    return h('span', { style: { color: "green" } }, "●");
  }
  if (val.originalItem?.bday) {
    return h('span', "🎂");
  }
  return h('span', { style: { color: "red" } }, "●");
};

const onClickEvent = (val: any) => {
  // console.log(val);
  console.log(val.title, val.originalItem?.content, val.startDate);
  toast.add({ severity: 'info', summary: helpers.renderDate(val.originalItem.alarm), detail: val.title, life: 3000 });
};

const onClickDay = (date: any, calendarItems: any) => {
  console.log(date, calendarItems);
  if (checked.value) {
    console.log("add event", date);
    visible.value = true;
    curDate.value = date;
    const dt = getLastMinute();
    // thisPost.value = {} as IPost;
    const exPost = posts.find((x: IPost) => String(x.alarm) === String(dt));
    if (exPost?.id) {
      thisPost.value = exPost;
    }
    editor.value?.commands.setContent((exPost?.content && JSON.parse(exPost?.content) || ''));
  } else {
    for (let item of calendarItems) {
      console.log(item);
      toast.add({ severity: 'info', summary: helpers.renderDate(item.originalItem.alarm), detail: item.title, life: 3000 });
    }
  }
  // this.selectionStart = null
  // this.selectionEnd = null
  // this.message = `You clicked: ${d.toLocaleDateString()}`
};

onBeforeMount(async () => {
  const personsData = await axios.get('/api/persons');
  const { data } = await axios.get('/api/deadlines', { params: { days: 30 } });
  const data2 = data.map((x: any) => ({ ...x, alarm: new Date(x.alarm), startDate: x.alarm, endDate: x.alarm }));
  const data3 = personsData.data.map((x: any) => ({ ...x, startDate: x.bday, endDate: x.bday, title: '🎂' + x.name }));

  const allData = data2.concat(data3);
  Object.assign(
    posts,
    allData
    // data2?.sort((a: any, b: any) => a.alarm.localeCompare(b.alarm))
  );

  const res = await axios.get('/api/cats');
  Object.assign(cats, res.data);

  const res2 = await axios.get('/api/tags');
  Object.assign(
    tags,
    res2.data
  );
});

const saveNote = async () => {
  visible.value = false;
  const realContent = editor.value?.getText();
  console.log(realContent);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // console.log(thisPost.value);

  const title = curDate.value.toLocaleDateString("ru-BY", options);
  // const time = Math.floor(curDate.value.getTime()) as any;
  // const t = String(Date.now());
  // console.log(t, time);

  const content = editor.value?.getJSON()
  if (realContent) {
    if (thisPost.value?.id) {
      console.log(thisPost.value);
      const exPost = posts.find(x => x.id === thisPost.value?.id);
      if (exPost?.id) {
        exPost.content = JSON.stringify(content);
        const { data } = await axios.post('/api/note', { ...thisPost.value, content });
        console.log(data);
      }
    } else {
      const newPost = {
        title,
        content,
        stamped: true,
        time: String(Date.now()),
        alarm: getLastMinute(),
        wholeday: true,
        faved: false,
        deleted: false,
        cat: 1,
      } as IPost;
      const { data } = await axios.post('/api/note', newPost);
      console.log(data);
      posts.push({ ...newPost, startDate: newPost.alarm, endDate: newPost.alarm, tooltip: newPost.content, id: data.id } as any);
    }
    // if (userdate.value) {
    //   if (isStamped.value) {
    //     newPost.time = userdate.value;
    //   } else {
    //     newPost.alarm = userdate.value;
    //   }
    // }
  }
};

const setLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href;
  const url = window.prompt('URL', previousUrl);
  // cancelled
  if (url === null) {
    return;
  }
  // empty
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }
  // update link
  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
};

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

.dot {
  top: 20px;
  border: none;
  background-color: transparent;
  cursor: pointer;
}
</style>
