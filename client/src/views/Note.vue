<template>
  <div class="text-center" style="text-align: center;">
    <InputText id="name" aria-describedby="name-help" type="text" v-model="note.title" class="p-d-block p-mx-auto"
      autocomplete="off" />
    <Button label="Save" @click="handleClick" />
    <div class="mt-2 mb-2">
      <Select v-model="selectedCat" :options="cats" optionLabel="title" optionValue="id" placeholder="Select a category"
        class="w-full md:w-14rem" />
      <!-- <label for="time24">Date time</label> -->
      <DatePicker id="time24" v-model="note.alarm" :showTime="true" :showIcon="true" :showButtonBar="true"
        :hideOnDateTimeSelect="true" :touchUI="true" :showOnFocus="false" dateFormat="yy.mm.dd" />
    </div>
    <div class="card flex justify-center">
      <MultiSelect v-model="selectedTags" :options="tags" optionLabel="title" optionsValue="id" filter
        placeholder="Select Tags" display="chip" :maxSelectedLabels="3" class="w-full md:w-80" />
    </div>
    <editor-content :editor="editor" class="editor" ref="contentRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { EditorContent } from '@tiptap/vue-3';
import helpers from '../helpers';

const selectedTags = ref([]);
const tags = ref();
const contentRef = ref<HTMLDivElement>();
const editor = helpers.setupEditor('');
const note = reactive({}) as IPost;
const cats = reactive([] as Array<ICat>);
const vuerouter = useRoute();
const id = vuerouter.params.id;
const selectedCat = ref(1);

const getTags = (str: string) => str ? JSON.parse(str) : [];

onBeforeMount(async () => {
  const tagsData = await axios.get('/api/tags');
  tags.value = tagsData.data;

  if (id) {
    const config = { params: { id: id } };
    const { data } = await axios.get('/api/note', config);
    if (data?.alarm) {
      data.alarm = new Date(data.alarm);
    }

    const tagIds = getTags(data.tags);
    selectedTags.value = tagsData.data.filter((x: any) => tagIds.find((y: any) => y === x.id));

    Object.assign(note, data);
    const ttInstance = (contentRef.value as any).editor;
    // console.log(data.content);
    ttInstance.commands.setContent(JSON.parse(data.content));
    selectedCat.value = note.cat;
    const res = await axios.get('/api/cats');
    Object.assign(
      cats,
      res.data
    );
  }
});

const handleClick = async () => {
  const datum = { ...note };
  // if (datum.alarm){
  //   datum.alarm = String(note.alarm.toJSON).slice(0, -5);
  // }
  datum.cat = selectedCat.value;
  datum.content = editor.value?.getJSON() || '';
  datum.tags = selectedTags.value.map((x: any) => x.id);
  console.log('note', datum);

  const { data } = await axios.post('/api/note', datum);
  console.log('post', data.id);
};
</script>
