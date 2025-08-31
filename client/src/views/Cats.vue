<template>
    <div class="text-center">
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

const cats = ref([] as Array<ICat>);

const saveItem = async (item: ICat) => {
    const result = await h.save('cats', item);
    console.log(result);
};

onBeforeMount(async () => {
    cats.value = await h.get('cats');
});
</script>
