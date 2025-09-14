<template>
  <div class="shadow-11 item p-2 mb-3 text-left" style="border: 1px dashed black; margin: 0 auto;" v-if="!item?.deleted"
    :title="helpers.renderDate(item?.time)">
    <div class="flex">
      <div class="mt-2">
        <Tag v-if="!item?.wholeday" :severity="item.cat === 1 ? 'warning' : 'success'"
          :value="props.categories.find(x => x.id === item.cat)?.title || '★'" class="mr-2"></Tag>
        <span class="p-1" v-if="item.alarm" style="color: red; font-weight: bold">{{ helpers.renderDate(item?.alarm, item?.wholeday)
        }}</span>
        <span class="p-1" v-if="item?.bday" style="color: orange; font-weight: bold">{{ helpers.renderDate(item?.bday,
          true)
          }}</span>
        <i class="pi pi-clock p-1" v-if="item.stamped" style="color:green"></i>
        <span v-if="!item?.bday">{{ helpers.renderDate(item.time) }}</span>
        <span class="title p-1">{{ item.title }}</span>
        <span v-html="renderTags(item.tags)"></span>
      </div>
      <div class="ml-auto">
        <Button icon="pi pi-times-circle" severity="danger" class="p-button-text" @click="remove(item)" />
        <Button :icon="`pi pi-heart${item?.faved ? '-fill' : ''}`" class="p-button-text" @click="addToFavs(item)" />
        <Button v-if="item?.id" icon="pi pi-pencil" class="p-button-text" @click="goToNote(item.id, item)" />
        <Button :disabled="!item.title" :icon="'pi pi-' + (item.full ? 'minus' : 'plus')" class="p-button-text"
          @click="item.full = !item.full" />
      </div>
    </div>
    <div v-if="!item.title || (item.content && item.full)" v-html="helpers.html(item.content)" class="content"></div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import router from '../router';
import helpers from '../helpers';

interface Props {
  post: IPost;
  tags: Array<ICat>;
  categories: Array<ICat>;
}

const props = defineProps<Props>();
const item = props.post;

const renderTags = (val: Array<ICat>) => {
if (val){
  const arr = typeof val === "string" ? JSON.parse(val) : val;
  return arr.map((x: any) => props.tags.find(y => y.id === x)).map((x: any) => '<span title="' + x?.title + '">' + (x?.emoji || x?.title.slice(0, 2)) + '</span>').join(' ');
  }
  return '';
}

const goToNote = (id: number, item: IPost) => {
  router.push(item?.bday ? `/person/${id}` : `/note/${id}`);
};

const remove = async (post: IPost) => {
  item.deleted = true;
  const { data } = await axios.delete(`/api/note/${post.id}`);
  console.log(data);
};

const addToFavs = async (item: IPost) => {
  console.log('like!');
  item.faved = !item.faved;
  const { data } = await helpers.save('fav', { id: item.id, status: item.faved });
  console.log(data);
};
</script>


<style>
.content {
  padding: 5px;
}
</style>