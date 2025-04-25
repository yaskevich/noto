<template>
  <div class="text-center">
    <h3>Persons</h3>
    <Button label="Add" class="p-button-secondary" @click="addPerson" />
    <div v-for="(item, key) in persons" class="shadow-11 item p-2 mb-3 text-left"
      style="border: 1px dashed black; margin: 0 auto" :key="key" :title="item.name">
      <div class="title mb-2">
        <Button :label="item.name" @click="goToPerson(item.id)" />
      </div>
      <div class="title">{{ item.bday }}</div>
      <div v-if="item.content" v-html="helpers.html(item.content)" class="content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue';
import axios from 'axios';
import router from '../router';
import helpers from '../helpers';
const persons = reactive([] as Array<IPerson>);

const goToPerson = (id: number) => {
  router.push(`/person/${id}`);
};

const addPerson = () => {
  router.push(`/person/`);
};

onBeforeMount(async () => {
  const { data } = await axios.get('/api/persons');
  console.log(data);
  Object.assign(persons, data);
});
</script>
