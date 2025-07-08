<template>
  <div>
    <div class="text-center" v-show="posts?.length">
      <div class="flex flex-wrap gap-3 mb-4">
        <div class="flex align-items-center">
          <RadioButton v-model="cat" inputId="category" name="cat" :value="0" @change="changeCategory(0)" />
          <label for="category" class="ml-2">
            <Button :disabled="true" label="ALL" @click="handleClick(0)" class="p-button-help" size="small" />
          </label>
          <template v-for="(item, key) in cats" :key="key">
            <RadioButton v-model="cat" :inputId="`cat${item.id}`" :name="`cat${item.id}`" :value="item.id"
              @change="changeCategory(item.id)" />
            <label :for="`cat${item.id}`" class="ml-2">
              <Button :label="item.title" @click="handleClick(item.id)" class="p-button-help" size="small" />
            </label>
          </template>
          <Badge :value="posts.length" severity="warning" class="ml-2"></Badge>
        </div>
      </div>
      <div class="mb-4 p-2" style="background-color: rgba(211, 211, 211, 0.279);">
        <div class="">
          <InputText id="search" aria-describedby="search-help" type="text" v-model="userinput" @input="inputEvent"
            class="p-d-block p-mx-auto" @keyup.enter="handleClick(0)" autocomplete="off" />
          <Button label="Save" @click="handleClick(0)" />
          <div class="mt-2">
            <!-- <label for="time24">Date time</label> -->
            <DatePicker ref="calRef" id="time24" v-model="userdate" :showTime="true" :showIcon="true"
              :showButtonBar="true" :hideOnDateTimeSelect="true" :touchUI="true" :showOnFocus="false"
              dateFormat="yy.mm.dd" />
          </div>
          <div class="p-2">
            <Checkbox v-model="isStamped" inputId="stamp" name="stamp" :binary="true" @click="enableStamped" />
            <label for="stamp" class="ml-2"> Timestamped </label>
          </div>
        </div>
        <div class="mt-2">
          <div v-if="editor">
            <div class="mb-2">
              <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }">setLink</button>
              <button @click="editor?.chain().focus().unsetLink().run()" :disabled="!editor.isActive('link')">
                unsetLink
              </button>
            </div>
            <editor-content :editor="editor" class="editor" id="editor" />
          </div>
        </div>
      </div>
      <Unit v-for="entry in posts" :post="entry" :categories="cats" :key="entry.id" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue';
import axios from 'axios';
import Unit from './Unit.vue';
import helpers from '../helpers';
import { EditorContent } from '@tiptap/vue-3';

const userinput = ref('');
const content = ref('');
const userdate = ref();
const isStamped = ref(false);
const posts = ref([] as Array<IPost>);
const cats = reactive([] as Array<ICat>);
const editor = helpers.setupEditor(content.value);
const cat = ref(0);
const calRef = ref(null as any);

const getPosts = async () => {
  const { data } = await axios.get('/api/data', { params: { cat: cat.value } });
  // console.log(data);
  if (data?.posts?.length) {
    const processed = data?.posts
      // ?.sort((a: any, b: any) => b.time - a.time)
      // .reverse()
      // .filter((x: any) => (selection === 'favs' ? x?.faved : x.id))
      // .slice(0, 2)
      ;
    posts.value = processed;
  } else {
    posts.value.splice(0);
  }
  Object.assign(cats, data.cats);
}

onBeforeMount(async () => {
  await getPosts();
});

const changeCategory = async (id: number) => {
  cat.value = id;
  await getPosts();
};

const enableStamped = () => {
  if (!userdate.value && calRef?.value) {
    calRef.value.updateModelTime();
    // userdate.value 1= (new Date).toISOString();
  }
};

const inputEvent = () => {
  // userinput.value = userinput.value.replace(/[^'’0-9а-яёўіa-z\- ]/gi, '');
  // console.log(userinput);
};

const handleClick = async (id: number) => {
  // console.log("date", userdate.value);
  const realContent = editor.value?.getText();

  if (realContent || userinput.value) {
    const content = editor.value?.getJSON();
    const newPost = {
      title: userinput.value,
      content: realContent ? content : '',
      stamped: isStamped.value,
      time: String(Date.now()),
      faved: false,
      deleted: false,
      cat: id || cat.value || 1,
      wholeday: false,
    } as IPost;
    if (userdate.value) {
      if (isStamped.value) {
        newPost.time = userdate.value;
      } else {
        newPost.alarm = userdate.value;
      }
    }
    const { data } = await axios.post('/api/note', newPost);
    // console.log("input", newPost);
    if (data?.id) {
      newPost.id = data.id;
      posts.value = [newPost, ...posts.value];
      userinput.value = '';
      userdate.value = null;
      isStamped.value = false;
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

  >*+* {
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
