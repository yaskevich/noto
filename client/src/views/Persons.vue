<template>
  <div class="text-center">
    <h3>Persons&nbsp({{ persons?.length }})</h3>
    <Button label="Add" class="p-button-secondary mb-2" @click="addPerson" />
    <div v-for="(item, key) in persons" class="shadow-11 item p-2 mb-3 text-left"
      style="border: 1px dashed black; margin: 0 auto" :key="key" :title="item.name">
      <div class="title mb-2">
        <Button :label="item.name" @click="goToPerson(item.id)" />
      </div>
      <div class="title">{{ helpers.formatDate(new Date(item.bday)) }}</div>
      <div v-if="item.content" v-html="helpers.html(item.content)" class="content"></div>
      <template v-if="mentions?.[String(item?.id)]">
        <span v-for="idx in mentions[String(item.id)]">
          <router-link :title="titles?.[String(idx)]" :to="`/note/${idx}`" class="mentioned">{{ idx }}</router-link>
        </span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import router from '../router';
import helpers from '../helpers';

const persons = ref([] as Array<IPerson>);
const mentions = ref();
const titles = ref();

const goToPerson = (id: number) => {
  router.push(`/person/${id}`);
};

const addPerson = () => {
  router.push(`/person/`);
};

onBeforeMount(async () => {
  persons.value = await helpers.get('persons', { all: 1 });
  const data = await helpers.get('titles');
  titles.value = Object.assign({}, ...(data.map((x: any) => ({ [x.id]: x.title }))));
  const output = await helpers.get('mentions');
  mentions.value = Object.assign({}, ...(output.map((x: keyable) => ({ [x.person]: [...new Set(JSON.parse(x.mentioned))] }))));
});


</script>
<style>
.mentioned {
  text-decoration: none;
  padding-right: 5px;
}
</style>
