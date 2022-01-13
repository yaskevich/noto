<script setup lang="ts">

  import { ref, onBeforeMount, } from 'vue';
  import axios from "axios";

  interface IItem {
    title: string;
    year: string;
    meta: string;
    type: string;
  };

  const info = ref();


  onBeforeMount(async () => {
    const {data} = await axios.get("/api/test");
    console.log(data);
    info.value = data;
  });


</script>

<template>

  <h2>data</h2>
  {{info}}
  <!--
      <div class="p-col">
        <Button :disabled="!selectedArea" label="Ачысціць" class="p-ml-2 p-button-raised p-button-text" @click="bib = bibliography;selectedArea = ''" />
      </div>
            -->

  <!-- <div v-for="(item, key) in bib" class="p-shadow-11 item" :key="key">{{item.title}}</div> -->

</template>

<style scoped>

</style>
