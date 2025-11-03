<template>
  <div class="text-center">
    <InputText id="name" aria-describedby="name-help" type="text" v-model="person.name" class="p-d-block p-mx-auto"
      autocomplete="off" />
    <Button label="Save" @click="handleClick" />

    <div class="mt-2 mb-2">
      <!-- <label for="time24">Date time</label> -->
      <DatePicker id="time24" v-model="person.bday" :showTime="false" :showIcon="true" :showButtonBar="true"
        :hideOnDateTimeSelect="true" :touchUI="true" :showOnFocus="false" dateFormat="yy.mm.dd" />
    </div>
    <div class="card flex justify-center">
      <MultiSelect v-model="selectedTags" :options="tags" optionLabel="title" optionsValue="id" filter
        placeholder="Select Tags" display="chip" :maxSelectedLabels="3" class="w-full md:w-80" />
    </div>
    <editor-content :editor="editor" class="editor" ref="contentRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { EditorContent } from '@tiptap/vue-3';
import helpers from '../helpers';
import router from '../router';

const contentRef = ref<HTMLDivElement>();
const editor = helpers.setupEditor('');
const person = ref({} as IPerson);
const vuerouter = useRoute();
const id = vuerouter.params.id;
const tags = ref([]);
const selectedTags = ref([]);


onBeforeMount(async () => {
  if (id) {
    tags.value = await helpers.get('tags');
    const data = await helpers.get('person', { id: id });
    const ttInstance = (contentRef.value as any).editor;
    ttInstance.commands.setContent(JSON.parse(data.content));
    person.value = data;
    const tagIds = helpers.getTags(data.tags);
    selectedTags.value = tags.value.filter((x: any) => tagIds.find((y: any) => y === x.id));

  }
});

const handleClick = async () => {
  const datum = { ...person.value };
  datum.content = editor?.value?.getJSON() || '';
  datum.tags = selectedTags.value.map((x: any) => x.id);
  const curDate = helpers.formatDate(datum.bday);
  if (curDate) {
    datum.bday = new Date(curDate);
  }
  // console.log("person", datum);
  const data = await helpers.save('person', datum);
  console.log('post', data);
  router.push(`/persons`);
};
</script>
