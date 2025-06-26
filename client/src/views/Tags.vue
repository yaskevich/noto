<template>
    <div class="mb-4">
        <InputText type="text" v-model="title" /><Button label="Save" @click="addTag" />
    </div>
    <div v-for="item in tags" style="font-weight: bold; margin-bottom:1rem; color:red">
        {{ item.title }}
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import h from '../helpers';

const title = ref('');
const tags = ref([] as Array<ICat>);
const addTag = async () => {
    const result = await h.save('tags', { title: title.value });
    // console.log(title.value, result);
    if (result.changes) {
        tags.value.push({ id: result.lastID, title: title.value })
        title.value = '';
    }
};

onBeforeMount(async () => tags.value = await h.get('tags'));
</script>
