<template>

  <div class="text-center" style="text-align:center;max-width:400px;margin: auto">

    <InputText id="name"
       aria-describedby="name-help"
       type="text"
       v-model="note.title"
       class="p-d-block p-mx-auto"
       autocomplete="off"
      />
      <Button label="Save" @click="handleClick" />

      <div class="mt-2 mb-2">
        <!-- <label for="time24">Date time</label> -->
        <Calendar id="time24"
                  v-model="note.date"
                  :showTime="false"
                  :showIcon="true"
                  :showButtonBar="true"
                  :hideOnDateTimeSelect="true"
                  :touchUI="true"
                  :showOnFocus="false"
                  dateFormat="yy.mm.dd" />
      </div>

      <editor-content :editor="editor" class="editor" ref="contentRef"/>
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

  interface INote {
     title: string;
     time: string;
     date: string;
     content: Object;
     id: number;
   };

  const note: INote = reactive({}) as INote;

  const vuerouter = useRoute();
  const id = vuerouter.params.id;
  console.log('note id', id);
  // import router from '../router';

  onBeforeMount(async () => {
    if (id) {
      const config = {};
      config['params'] = { id: id };
      const { data } = await axios.get('/api/note', config);
      console.log("database", data);
      // data.bday = data.bday.replaceAll('-', '.');
      Object.assign(note, data);
      const ttInstance = (contentRef.value as any).editor;
      ttInstance.commands.setContent(JSON.parse(data.content));
    }
  });

  const handleClick = async () => {
    // const datum = {...note};
    // datum.content = editor.value.getJSON();
    // datum.bday = helpers.formatDate(datum.bday);
    // // console.log("note", datum);
    // const { data } = await axios.post('/api/note', datum);
    // console.log("post", data);
  };

</script>
