<template>
  <div>
    <!-- <h2>Notes</h2> -->
    <div class="mb-6">
      <Button
        :label="item.title"
        @click="selectGroup(key)"
        v-for="(item, key) in cats"
        class="mr-4 p-button-help"
        :key="key" />
    </div>
    <div class="text-center">
      <div class="mb-6" style="border: 1px solid red">
        <div class="mt-3">
          <InputText
            id="search"
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
            <Calendar
              id="time24"
              v-model="userdate"
              :showTime="true"
              :showIcon="true"
              :showButtonBar="true"
              :hideOnDateTimeSelect="true"
              :touchUI="true"
              :showOnFocus="false"
              dateFormat="yy.mm.dd" />
          </div>
        </div>
        <div class="mt-3 mb-3">
          <div v-if="editor">
            <div>
              <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }">setLink</button>
              <button @click="editor?.chain().focus().unsetLink().run()" :disabled="!editor.isActive('link')">
                unsetLink
              </button>
            </div>
            <editor-content :editor="editor" class="editor" />
          </div>
        </div>
      </div>
      <Unit v-for="entry in posts" :post="entry" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onBeforeMount, defineProps } from 'vue';
import axios from 'axios';
import Unit from './Unit.vue';
import helpers from '../helpers';
import { useRoute } from 'vue-router';
import { EditorContent } from '@tiptap/vue-3';

const vuerouter = useRoute();
const selection = String(vuerouter.params.id);
const userinput = ref('');
const content = ref('');
const userdate = ref();
const posts = reactive([] as Array<IPost>);
const cats = reactive([] as Array<ICat>);
const editor = helpers.setupEditor(content.value);

onBeforeMount(async () => {
  const { data } = await axios.get('/api/data');
  // console.log(data);
  const processed = data?.posts
    ?.sort((a: any, b: any) => b.time - a.time)
    .reverse()
    .filter((x: any) => (selection === 'favs' ? x?.faved : x.id));
  Object.assign(posts, processed);
  Object.assign(cats, data.cats);
});

const inputEvent = () => {
  // userinput.value = userinput.value.replace(/[^'’0-9а-яёўіa-z\- ]/gi, '');
  // console.log(userinput);
};

const handleClick = async () => {
  // console.log("date", userdate.value);
  if (userinput.value) {
    const content = editor.value?.getJSON();
    const realContent = editor.value?.getText();
    // console.log("click!", userinput.value, content);
    const { data } = await axios.post('/api/save', {
      title: userinput.value,
      date: userdate.value,
      content: realContent ? content : '',
    });
    if (data?.id) {
      console.log(data);
      const newPost = {
        content: realContent ? content : '',
        title: userinput.value,
        deleted: false,
        id: data.id,
        time: String(Date.now()),
        date: userdate.value,
      } as IPost;

      posts.unshift(newPost);
      userinput.value = '';
      editor.value?.commands.setContent('');
    }
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

const selectGroup = (id: number) => {
  console.log('group', id);
};
</script>
<style lang="scss">
.title {
  font-weight: bold;
}
label {
  margin: 0 0.5em;
  font-weight: bold;
}

.p-field * {
  display: block;
}

.editor {
  display: inline-block;
  text-align: left;
  background: lightyellow;
  min-width: 100%;
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
