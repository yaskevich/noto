<template>
  <div class="text-center">
    <InputText
      id="name"
      aria-describedby="name-help"
      type="text"
      v-model="person.name"
      class="p-d-block p-mx-auto"
      autocomplete="off" />
    <Button label="Save" @click="handleClick" />

    <div class="mt-2 mb-2">
      <!-- <label for="time24">Date time</label> -->
      <Calendar
        id="time24"
        v-model="person.bday"
        :showTime="false"
        :showIcon="true"
        :showButtonBar="true"
        :hideOnDateTimeSelect="true"
        :touchUI="true"
        :showOnFocus="false"
        dateFormat="yy.mm.dd" />
    </div>

    <editor-content :editor="editor" class="editor" ref="contentRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import helpers from '../helpers';

const contentRef = ref<HTMLDivElement>();
const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Link,
    Placeholder.configure({
      placeholder: 'Write something',
      showOnlyWhenEditable: false,
      showOnlyCurrent: false,
    }),
  ],
});

const person = reactive({}) as IPerson;
const vuerouter = useRoute();
const id = vuerouter.params.id;
console.log('person id', id);
// import router from '../router';

onBeforeMount(async () => {
  if (id) {
    const config = { params: { id: id } };
    const { data } = await axios.get('/api/person', config);
    // console.log("database", data);
    data.bday = data.bday.replaceAll('-', '.');
    Object.assign(person, data);
    const ttInstance = (contentRef.value as any).editor;
    ttInstance.commands.setContent(JSON.parse(data.content));
  }
});

const handleClick = async () => {
  const datum = { ...person };
  datum.content = editor?.value?.getJSON() || '';
  const curDate = helpers.formatDate(datum.bday);
  if (curDate) {
    datum.bday = new Date(curDate);
  }
  // console.log("person", datum);
  const { data } = await axios.post('/api/person', datum);
  console.log('post', data);
};
</script>
