<template>
    <div class="mb-4">
        <InputText type="text" v-model="title" /><Button label="Save" @click="addTag" />
    </div>
    <div v-for="(item, index) in tags" style="font-weight: bold; margin-bottom:1rem; color:red">
        {{ item.title }} <Button label="Delete" @click="deleteTag(item, index)" />
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

const deleteTag = async (entry: ICat, num: number) => {
    const result = await h.del('tags', { id: entry.id });
    if (result) {
        console.log("delete", entry.id, result, num);
        tags.value.splice(num, 1);
    }
};

onBeforeMount(async () => tags.value = await h.get('tags'));
</script>
