<script setup lang="ts">

  import { ref, reactive, onBeforeMount, } from 'vue';
  import axios from "axios";

  interface IItem {
    title: string;
    year: string;
    meta: string;
    type: string;
  };

  const info = reactive({});
  const userinput = ref('');

  onBeforeMount(async () => {
    const {data} = await axios.get("/api/data");
    console.log(data);
    Object.assign(info, data);
  });

  const inputEvent = () => {
    // userinput.value = userinput.value.replace(/[^'’0-9а-яёўіa-z\- ]/gi, '');
    // console.log(userinput);
  };

  const handleClick = async () => {
    if(userinput.value) {
      console.log("click!", userinput.value);
      const {data} = await axios.post("/api/save", {"text": userinput.value});
      if (data?.id) {
          console.log(data);
          info.data.posts.push({"content": userinput.value, "deleted": false, id: data.id, time: Date.now(), });
          userinput.value = '';
      }
    }
  }

</script>

<template>

  <h2>Notes</h2>

  <div class="mb-6">
    <Button :label="item" @click=""  v-for="(item, key) in info?.data?.cats" class="mr-4 p-button-help" />
  </div>

  <div class="text-center" style="text-align:center;">
    <div class="mb-6">
      <InputText id="search" aria-describedby="search-help" type="text" v-model="userinput" @input="inputEvent" class="p-d-block p-mx-auto" @keyup.enter="handleClick"/><Button label="Save" @click="handleClick"  />
      <small id="search-help" class="ml-2">...</small>
    </div>
  <div v-for="(item, key) in info?.data?.posts" class="shadow-11 item p-2 mb-3 text-center" style="border: 1px dashed pink;max-width:400px;margin:0 auto;" :key="key" :title="(new Date(item?.time)).toLocaleString('en-UK', { timeZone: 'Europe/Minsk' }).split('/').join('.').replace(',', '')">
    {{item.content}}
  </div>

</div>
  <!--
      <div class="p-col">
        <Button :disabled="!selectedArea" label="Ачысціць" class="p-ml-2 p-button-raised p-button-text" @click="bib = bibliography;selectedArea = ''" />
      </div>
            -->

  <!-- <div v-for="(item, key) in bib" class="p-shadow-11 item" :key="key">{{item.title}}</div> -->

</template>

<style scoped>
label {
  margin: 0 0.5em;
  font-weight: bold;
}

.p-field * {
  display: block;
}
.p-inputtext {
  /* text-align:center !important; */
}
</style>
