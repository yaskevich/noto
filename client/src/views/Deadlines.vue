<template>

  <div class="text-center" style="text-align:center;max-width:400px;margin: auto">
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

</template>

<script setup lang="ts">

  import { ref, reactive, onBeforeMount } from 'vue';
  import axios from 'axios';
  import { generateHTML } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Link from '@tiptap/extension-link';

  interface IItem {
    title: string;
    year: string;
    meta: string;
    type: string;
  }

  const html = (x: any) =>
    x && x !== '""' ? generateHTML(typeof x === 'string' ? JSON.parse(x) : x, [StarterKit, Link]) : '';

  const posts = reactive([]);

  onBeforeMount(async () => {
    const { data } = await axios.get('/api/deadlines');
    console.log(data);
    Object.assign(posts, data?.sort((a, b) => b.time - a.time).reverse());
    console.log(posts);
  });

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

</script>
