<script setup lang="ts">

  import { ref, reactive, onBeforeMount } from 'vue';
  import axios from 'axios';
  import { useEditor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';
  import Placeholder from '@tiptap/extension-placeholder';
  import Link from '@tiptap/extension-link';
  import { generateHTML } from '@tiptap/core';

  interface IItem {
    title: string;
    year: string;
    meta: string;
    type: string;
  }

  const html = (x: any) =>
    x && x !== '""' ? generateHTML(typeof x === 'string' ? JSON.parse(x) : x, [StarterKit, Link]) : '';

  const userinput = ref('');

  const content = ref('');
  const userdate = ref(null);
  const posts = reactive([]);
  const cats = reactive([]);

  const editor = useEditor({
    content: content.value,
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

  onBeforeMount(async () => {
    const { data } = await axios.get('/api/data');
    console.log(data);
    Object.assign(posts, data?.posts?.sort((a, b) => b.time - a.time).reverse());
    Object.assign(cats, data.cats);
  });

  const inputEvent = () => {
    // userinput.value = userinput.value.replace(/[^'’0-9а-яёўіa-z\- ]/gi, '');
    // console.log(userinput);
  };

  const renderDate = (x: any) => {
    if (x) {
      return new Date(x)
        .toLocaleString('en-UK', { timeZone: 'Europe/Minsk' })
        .split('/')
        .join('.')
        .replace(',', '')
        .slice(0, -3);
    }
  };

  const handleClick = async () => {
    // console.log("date", userdate.value);
    if (userinput.value) {
      const content = editor.value.getJSON();
      const realContent = editor.value.getText();
      // console.log("click!", userinput.value, content);
      const { data } = await axios.post('/api/save', {
        title: userinput.value,
        date: userdate.value,
        content: realContent ? content : '',
      });
      if (data?.id) {
        console.log(data);
        posts.unshift({
          content: realContent ? content : '',
          title: userinput.value,
          deleted: false,
          id: data.id,
          time: Date.now(),
          date: userdate.value,
        });
        userinput.value = '';
        editor.value.commands.setContent('');
      }
    }
  };

  const setLink = () => {
    const previousUrl = editor.value.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.value
        .chain()
        .focus()
        .extendMarkRange('link')
        .unsetLink()
        .run();

      return;
    }

    // update link
    editor.value
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  };

</script>

<template>

  <h2>Notes</h2>

  <div class="mb-6">
    <Button :label="item.title" @click="" v-for="(item, key) in cats" class="mr-4 p-button-help" />
  </div>

  <div class="text-center" style="text-align:center;max-width:400px;margin: auto">
    <div class="mb-6" style="border: 1px solid red;">
      <div class="mt-3">
        <InputText id="search"
                   aria-describedby="search-help"
                   type="text"
                   v-model="userinput"
                   @input="inputEvent"
                   class="p-d-block p-mx-auto"
                   @keyup.enter="handleClick"
                   autocomplete="off" />
        <Button label="Save" @click="handleClick" />
        <div class="mt-2">
          <!-- <label for="time24">Date time</label> -->
          <Calendar id="time24"
                    v-model="userdate"
                    :showTime="true"
                    :showIcon="true"
                    :showButtonBar="true"
                    :hideOnDateTimeSelect="true"
                    :touchUI="true"
                    :showOnFocus="false"
                    dateFormat="dd.mm.y" />
        </div>
      </div>
      <div class="mt-3 mb-3">
        <div v-if="editor">
          <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }">
              setLink
            </button>
          <button @click="editor.chain().focus().unsetLink().run()" :disabled="!editor.isActive('link')">
              unsetLink
            </button>
          <editor-content :editor="editor" class="editor" />
        </div>
      </div>
    </div>

    <div v-for="(item, key) in posts"
         class="shadow-11 item p-2 mb-3 text-left"
         style="border: 1px dashed black;margin:0 auto;"
         :key="key"
         :title="renderDate(item?.time)">
      <div v-if="item.date" style="color:red;font-weight:bold;">{{renderDate(item?.date)}}</div>
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
