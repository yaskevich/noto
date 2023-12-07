<template>
  <div class="shadow-11 item p-2 mb-3 text-left" style="border: 1px dashed black; margin: 0 auto;" v-if="!item?.deleted"
    :title="helpers.renderDate(item?.time)">
    <div class="flex">
      <div class="mt-2">
        <span class="p-1" v-if="item.alarm" style="color: red; font-weight: bold">{{ helpers.renderDate(item?.alarm)
        }}</span>
        <i class="pi pi-clock p-1" v-if="item.stamped" style="color:green"></i>
        <span>{{ helpers.renderDate(item.time) }}</span>
        <span class="title p-1">{{ item.title }}</span>
      </div>
      <div class="ml-auto">
        <Button icon="pi pi-times-circle" severity="danger" class="p-button-text" @click="remove(item)" />
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

const remove = async (post: IPost) => {
  item.deleted = true;
  const { data } = await axios.delete(`/api/note/${post.id}`);
  console.log(data);
};

const addToFavs = async (item: IPost) => {
  console.log('like!');
  item.faved = !item.faved;
  const { data } = await axios.post('/api/fav', { id: item.id, status: item.faved });
  console.log(data);
};
</script>


<style>
.content {
  padding: 5px;
}
</style>