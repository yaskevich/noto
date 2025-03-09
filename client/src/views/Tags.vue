<template>
<div v-for="item in tags" style="font-weight: bold; margin-bottom:1rem; color:red">
    {{ item.title }}
</div>
</template>

<script setup lang="ts">
import { reactive, onBeforeMount } from 'vue';
import axios from 'axios';

const tags = reactive([] as Array<ICat>);

onBeforeMount(async () => {
    const res = await axios.get('/api/tags');
    Object.assign(
        tags,
        res.data
    );
});
</script>
    