<template>
  hello
</template>

<script setup lang="ts">

  import { ref, reactive, onBeforeMount } from 'vue';
  import axios from 'axios';
  import { generateHTML } from '@tiptap/core';

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
    Object.assign(posts, data?.posts?.sort((a, b) => b.time - a.time).reverse());

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
