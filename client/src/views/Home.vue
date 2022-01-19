<script setup lang="ts">

  import { ref, reactive, onBeforeMount, } from 'vue';
  import axios from "axios";
  import { useEditor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';
  import Placeholder from '@tiptap/extension-placeholder';
  import { generateHTML } from '@tiptap/core';


  interface IItem {
    title: string;
    year: string;
    meta: string;
    type: string;
  };


  const html = (x:any) => generateHTML(x, [ StarterKit,]);

  const info = reactive({});
  const userinput = ref('');

  const content = ref('');

  const editor = useEditor({
    content: content.value,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something',
        showOnlyWhenEditable: false,
        showOnlyCurrent: false,
      }),
    ],
  });

  onBeforeMount(async () => {
    const {data} = await axios.get("/api/data");
    console.log(data);
    Object.assign(info, data);
  });

  const inputEvent = () => {
    // userinput.value = userinput.value.replace(/[^'’0-9а-яёўіa-z\- ]/gi, '');
    // console.log(userinput);
  };

  const handleClick = async () => {
    if(userinput.value) {
      const content = editor.value.getJSON();
      const realContent = editor.value.getText();
      console.log("click!", userinput.value, content);
      const {data} = await axios.post("/api/save", {"title": userinput.value, "content": realContent?content:''});
      if (data?.id) {
          console.log(data);
          info.data.posts.push({"content": realContent?content:'', "title": userinput.value, "deleted": false, id: data.id, time: Date.now(), });
          userinput.value = '';
          editor.value.commands.setContent('');
      }
    }
  }

</script>

<template>

  <h2>Notes</h2>

  <div class="mb-6">
    <Button :label="item" @click=""  v-for="(item, key) in info?.data?.cats" class="mr-4 p-button-help" />
  </div>

  <div class="text-center" style="text-align:center;max-width:400px;margin: auto">
    <div class="mb-6" style="border: 1px solid red;">
      <div class="mt-3">
        <InputText id="search" aria-describedby="search-help" type="text" v-model="userinput" @input="inputEvent" class="p-d-block p-mx-auto" @keyup.enter="handleClick"/><Button label="Save" @click="handleClick"  />
      </div>
      <div class="mt-3 mb-3">
        <editor-content :editor="editor" class="editor"/>
      </div>
    </div>

  <div v-for="(item, key) in info?.data?.posts" class="shadow-11 item p-2 mb-3 text-left" style="border: 1px dashed black;margin:0 auto;" :key="key" :title="(new Date(item?.time)).toLocaleString('en-UK', { timeZone: 'Europe/Minsk' }).split('/').join('.').replace(',', '')">
    <span class="title">{{item.title}}</span>
    <div v-if="item.content" v-html="html(item.content)" class="content"></div>
  </div>

</div>
  <!--
      <div class="p-col">
        <Button :disabled="!selectedArea" label="Ачысціць" class="p-ml-2 p-button-raised p-button-text" @click="bib = bibliography;selectedArea = ''" />
      </div>
            -->

  <!-- <div v-for="(item, key) in bib" class="p-shadow-11 item" :key="key">{{item.title}}</div> -->

</template>

<style lang="scss">
label {
  margin: 0 0.5em;
  font-weight: bold;
}

.p-field * {
  display: block;
}
.p-inputtext {
  /* text-align:center !important; */
}

.editor {
  display: inline-block;
  text-align: left;
  width: 300px;
  background: lightyellow;
  padding: 15px;
}

.ProseMirror {
  padding: 15px;
  > * + * {
    margin-top: 0.75em;
  }
}

/* Placeholder (at the top) */
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.content {
  border: 1px dashed silver;
  font-family: monospace;
}
</style>
