<template>
    <div class="text-center">
        <div class="mb-4">
            <InputText type="text" v-model="title" /><Button label="Add" @click="addItem" />
        </div>

        <div v-for="(item, index) in cats" :key="index" class="p-1" style="max-width:300px;margin: 0 auto">
            <InputGroup class="">
                <InputText type="text" v-model="item.title" />
                <Button icon="pi pi-check" @click="saveItem(item)" />
            </InputGroup>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import h from '../helpers';

const title = ref('');
const cats = ref([] as Array<ICat>);

const saveItem = async (item: ICat) => {
    const result = await h.save('cats', item);
    console.log(result);
};

const addItem = async () => {
    const result = await h.save('cats', { title: title.value });
    // console.log(title.value, result);
    if (result.changes) {
        cats.value.push({ id: result.lastID, title: title.value })
        title.value = '';
    }
};

onBeforeMount(async () => cats.value = await h.get('cats'));
</script>
