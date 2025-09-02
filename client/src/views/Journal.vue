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
          <div :class="[0, 6].includes(day[6]) ? 'weekend' : ''">
            <Button severity="secondary" :class="'text-center p-3 border-round-sm ' + setRenderClass(day)"
              :label="`${day[2]} ${checked ? helpers.months[day[4]] : day[1]}`"
              :title="`${datesDone?.[valToKey(day)]?.title || '<no data>'}`" @click="showEditor(day)" />
            <div v-html="tagIdToTitle(day)"></div>
          </div>
        </div>
      </div>
    </div>


    <div class="text-center">
      <Unit :categories="cats" v-for="entry in posts" :post="entry" />
    </div>
  </div>

  <Dialog v-model:visible="visible" modal header="Save Note" class="mdl">
    <div>
      <div v-if="editor" class="mb-2">
        <div class="mb-2">
          <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }">setLink</button>
          <button @click="editor?.chain().focus().unsetLink().run()" :disabled="!editor.isActive('link')">
            unsetLink
          </button>
        </div>
        <editor-content :editor="editor" class="editor" />
      </div>
      <div> Completed
        <ToggleSwitch v-model="completed" />
      </div>
      <div class="mb-2">
        <MultiSelect v-model="selTags" :options="tags" optionLabel="title" filter placeholder="Select tags"
          :maxSelectedLabels="3" class="w-full md:w-80" />
      </div>
      <div class="inline-flex flex-col justify-content-between items-start gap-2 w-full pt-4 pb-2">
        <Button type="button" label="Cancel" severity="info" @click="visible = false"></Button>
        <Button type="button" label="Save" @click="saveNote"></Button>
      </div>
    </div>
  </Dialog>

</template>

<script setup lang="ts">
import { ref, onBeforeMount, toRaw } from 'vue';
import Unit from './Unit.vue';
import helpers from '../helpers';
import router from '../router';
import { EditorContent } from '@tiptap/vue-3';

const posts = ref([] as Array<IPost>);
const cats = ref([] as Array<ICat>);
const order = (new Date()).getDay();
const range = ref([28, 70, 140, 350]);
const selectedNumber = ref(toRaw(range.value?.[0]));
const allDays = ref();
const datesDone = ref({} as keyable);
const isLoaded = ref(false);
const checked = ref(false);
const visible = ref(false);
const thisPost = ref<IPost>();
const editor = helpers.setupEditor(thisPost?.value?.content || '');
const selTags = ref();
const tags = ref([] as Array<ICat>);
const curDate = ref();

const toDateArray = (date: Date, num = 0) => [...date.toString().split(' ').slice(0, 4), date.getMonth(), num, date.getDay()];
const valToKey = (val: Array<number>) => `${val[3]}-${String(val[4] + 1).padStart(2, '0')}-${val[2]}`;
const completed = ref(true);

const tagIdToTitle = (day: Array<number>) => {
  const item = datesDone.value?.[valToKey(day)];
  const tagInput = item?.tags;
  if (tagInput) {
    const arr = typeof tagInput === "string" ? JSON.parse(tagInput) : tagInput;
    return arr.map((x: any) => tags.value.find(y => y.id === x)).map((x: any) => '<span title="' + x?.title + '">' + (x?.emoji || x?.title.slice(0, 2)) + '</span>').join(' ');
  }
  return '';
};

const setRenderClass = (val: Array<number>) => {
  if (Object.keys(datesDone.value)?.includes(valToKey(val))) {
    if (datesDone.value[valToKey(val)]?.completed === 0) {
      return 'bg-orange-400';
    }
    if (!val[5]) {
      return 'bg-green-500';
    }
    return 'bg-green-300';
  }
  if (!val[5]) {
    return 'bg-blue-400';
  }
  if (val[5] > 0) {
    return 'surface-50';
  }
  return 'bg-red-400';
};

const saveNote = async () => {
  // console.log("save");
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const title = curDate.value.toLocaleDateString("ru-BY", options);
  const content = editor.value?.getJSON();
  const newPost = {
    title,
    content,
    tags: toRaw(selTags.value?.map((x: any) => x.id)),
    stamped: true,
    time: String(Date.now()),
    alarm: helpers.getLastMinute(curDate.value),
    wholeday: true,
    faved: false,
    deleted: false,
    cat: 1,
    completed: completed.value,
  } as IPost;

  const key = helpers.formatDate(curDate.value);
  if (key) {
    const data = await helpers.save('note', newPost);
    // console.log(data);
    const fullPost = { ...newPost, startDate: newPost.alarm, endDate: newPost.alarm, tooltip: newPost.content, id: data.id } as any;
    posts.value.push(fullPost);
    datesDone.value[key] = fullPost;
    visible.value = false;
    completed.value = true;
  }
};

const onClickDay = (key: string) => {
  console.log("add event", key);
  curDate.value = new Date(key);
  visible.value = true;
  editor.value?.commands.setContent('');
};

const showEditor = (val: Array<number>) => {
  const key = valToKey(val);
  const datum = datesDone.value?.[key];
  if (datum?.id) {
    router.push(`/note/${datum.id}`);
  } else {
    console.log('new entry');
    // router.push(`/note/`);
    onClickDay(key);
  }
  // console.log(datum);
};

const toKey = (val: IPost) => {
  const key = val?.alarm?.toString()?.slice(0, 10);
  // const arr = toDateArray(new Date(val.time));
  if (key) {
    datesDone.value[key] = val;
  }
};

const getData = async () => {
  const data = await helpers.get('dated', { params: { days: selectedNumber.value } });
  data.filter((x: IPost) => x.wholeday && x.time && x).map((x: IPost) => toKey(x));
  posts.value = data?.sort((a: any, b: any) => {
    const atime = a.stamped ? (Number.isInteger(a.time) ? (new Date(a.time)).toISOString() : a.time) : a.alarm;
    const btime = b.stamped ? (Number.isInteger(b.time) ? (new Date(b.time)).toISOString() : b.time) : b.alarm;
    return btime.localeCompare(atime);
  });
};

onBeforeMount(async () => {
  tags.value = await helpers.get('tags');
  cats.value = await helpers.get('cats');
  await getData();
  isLoaded.value = true;
});

const getDate = (num: number) => {
  const date = new Date();
  date.setDate(date.getDate() + num);
  return toDateArray(date, num);
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

const change = async () => {
  await getData();
  makeList();
};

makeList();
</script>
<style>
.weekend {
  border: 3px dashed pink;
}

.mdl {
  width: 25rem;
  font-family: Avenir, Helvetica, Arial, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.p-multiselect-option {
  font-family: Avenir, Helvetica, Arial, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

}
</style>
