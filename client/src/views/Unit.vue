<template>
  <div
    class="shadow-11 item p-2 mb-3 text-left"
    style="border: 1px dashed black; margin: 0 auto"
    :title="helpers.renderDate(item?.time)">
    <div v-if="item.date" style="color: red; font-weight: bold">{{ helpers.renderDate(item?.date) }}</div>
    <div class="flex">
      <div class="mt-2">
        <span class="title">{{ item.title }}</span>
      </div>
      <div class="ml-auto">
        <Button :icon="`pi pi-heart${item?.faved ? '-fill' : ''}`" class="p-button-text" @click="addToFavs(item)" />
        <Button icon="pi pi-pencil" class="p-button-text" @click="goToNote(item.id)" />
      </div>
    </div>
    <div v-if="item.content" v-html="helpers.html(item.content)" class="content"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios';
import router from '../router';
import helpers from '../helpers';

interface Props {
  post: IPost;
}

const props = defineProps<Props>();
// console.log(props);
const item = props.post;

const goToNote = (id: number) => {
  router.push(`/note/${id}`);
};

const addToFavs = async (item: IPost) => {
  console.log('like!');
  item.faved = !item.faved;
  const { data } = await axios.post('/api/fav', { id: item.id, status: item.faved });
  console.log(data);
};
</script>
