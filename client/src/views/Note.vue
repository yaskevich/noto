<template>
  <div class="text-center" style="text-align: center;">
    <InputText id="name" aria-describedby="name-help" type="text" v-model="note.title" class="p-d-block p-mx-auto"
      autocomplete="off" />
    <Button label="Save" @click="handleClick" />
    <div class="mt-2 mb-2">
      <Dropdown v-model="selectedCat" :options="cats" optionLabel="title" optionValue="id" placeholder="Select a City"
        class="w-full md:w-14rem" />
      <!-- <label for="time24">Date time</label> -->
      <Calendar id="time24" v-model="note.alarm" :showTime="true" :showIcon="true" :showButtonBar="true"
        :hideOnDateTimeSelect="true" :touchUI="true" :showOnFocus="false" dateFormat="yy.mm.dd" />
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

const contentRef = ref<HTMLDivElement>();
const editor = helpers.setupEditor('');
const note = reactive({}) as IPost;
const cats = reactive([] as Array<ICat>);
const vuerouter = useRoute();
const id = vuerouter.params.id;
const selectedCat = ref(1);

onBeforeMount(async () => {
  if (id) {
    const config = { params: { id: id } };
    const { data } = await axios.get('/api/note', config);
    if (data?.alarm) {
      data.alarm = new Date(data.alarm);
    }
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
  datum.cat = selectedCat.value;
  datum.content = JSON.stringify(editor.value?.getJSON()) || '';
  // console.log('note', datum);
  const { data } = await axios.post('/api/note', datum);
  console.log('post', data.id);
};
</script>
