<template>
    <div class="text-center">
        <div class="mb-4">
            <InputText type="text" v-model="title" /><Button label="Add" @click="addTag" />
        </div>

        <div v-for="(item, index) in tags" class="p-1" style="max-width:350px;margin: 0 auto">
            <div class="flex justify-content-between flex-wrap">
                <div class="flex align-items-center justify-content-center">
                    <Button :label="(item?.emoji || '?') + ' ' + item.title" severity="secondary"
                        @click="renderDialog(item)" />
                </div>

                <div class="flex align-items-center justify-content-center">
                    {{ tagstat[item.id] }}<Button label="Delete" severity="danger" @click="deleteTag(item, index)" />
                </div>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="visible" modal :header="'Update emoji: ' + selectedEmoji" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block"></span>
        <div class="flex items-center gap-4 mb-4">
            <EmojiPicker :native="true" @select="onSelectEmoji" disable-skin-tones />
        </div>
        <div class="flex justify-end gap-2 mb-4">
            <InputText type="text" v-model="selectedTitle" />
        </div>

        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
            <Button type="button" label="Save" @click="saveItem"></Button>
        </div>
    </Dialog>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import h from '../helpers';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';

const selected = ref<ICat>();
const visible = ref(false);
const selectedEmoji = ref<string>('');
const selectedTitle = ref<string>('');

const title = ref('');
const tags = ref([] as Array<ICat>);
const tagstat = ref({} as keyable);

const renameTag = async (entry: ICat, num?: number) => {
    const result = await h.save('tags', entry);
    if (result.changes) {
        console.log(result, entry, num);
    }
};

const addTag = async () => {
    const result = await h.save('tags', { title: title.value, emoji: selectedEmoji.value || '' });
    // console.log(title.value, result);
    if (result.changes) {
        tags.value.push({ id: result.lastID, title: title.value })
        title.value = '';
    }
};

const onSelectEmoji = async (emoji: any) => {
    console.log('selected', emoji.i);
    selectedEmoji.value = emoji.i;
};

const saveItem = async () => {
    if (selected.value) {
        selected.value.emoji = selectedEmoji.value;
        selected.value.title = selectedTitle.value;
        await renameTag(selected.value)
    }
    visible.value = false;
};

const renderDialog = (item: ICat) => {
    selected.value = item;
    selectedEmoji.value = item?.emoji || '';
    selectedTitle.value = item?.title || '';
    visible.value = true;
};

const deleteTag = async (entry: ICat, num: number) => {
    const result = await h.del('tags', { id: entry.id });
    if (result) {
        console.log("delete", entry.id, result, num);
        tags.value.splice(num, 1);
    }
};

onBeforeMount(async () => {
    tags.value = await h.get('tags');
    tagstat.value = await h.get('tagstat');
});
</script>
