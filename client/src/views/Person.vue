<template>
  <!-- {{person}} -->
  <div class="text-center" style="text-align:center;max-width:400px;margin: auto">
    <InputText id="name"
       aria-describedby="name-help"
       type="text"
       v-model="person.name"
       class="p-d-block p-mx-auto"
       autocomplete="off"
      />
      <Button label="Save" @click="handleClick" />
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
  import { generateHTML } from '@tiptap/core';

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

  interface IPerson {
     name: string;
     bday: string;
     content: Object;
     id: number;
   };

  const person: IPerson = reactive({}) as IPerson;

  const vuerouter = useRoute();
  const id = vuerouter.params.id;
  console.log('person id', id);
  // import router from '../router';

  onBeforeMount(async () => {
    if (id) {
      const config = {};
      config['params'] = { id: id };
      const { data } = await axios.get('/api/person', config);
      // console.log(data);
      Object.assign(person, data);
      const ttInstance = (contentRef.value as any).editor;
      ttInstance.commands.setContent(JSON.parse(data.content));
    }
  });


  const handleClick = async () => {
    const content = editor.value.getJSON();
    person.content = content;
    console.log("person", person);
    const { data } = await axios.post('/api/person', person);
    console.log("post", data);
  };


</script>
