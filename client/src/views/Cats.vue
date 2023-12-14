<template>
    <div class="text-center">
        <div v-for="(item, index) in cats" :key="index" class="p-1" style="max-width:300px;margin: 0 auto">
            <InputGroup class="">
                <InputText type="text" v-model="item.title" />
                <Button icon="pi pi-check" />
            </InputGroup>
        </div>
    </div>
</template>
    
<script setup lang="ts">
import { reactive, onBeforeMount } from 'vue';
import axios from 'axios';
import Unit from './Unit.vue';

const cats = reactive([] as Array<ICat>);

onBeforeMount(async () => {
    const res = await axios.get('/api/cats');
    Object.assign(
        cats,
        res.data
    );
});
</script>
    