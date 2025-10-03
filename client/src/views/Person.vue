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

onBeforeMount(async () => {
  if (id) {
    const data = await helpers.get('person', { id: id });
    const ttInstance = (contentRef.value as any).editor;
    ttInstance.commands.setContent(JSON.parse(data.content));
    person.value = data;
  }
});

const handleClick = async () => {
  const datum = { ...person.value };
  datum.content = editor?.value?.getJSON() || '';
  const curDate = helpers.formatDate(datum.bday);
  if (curDate) {
    datum.bday = new Date(curDate);
  }
  // console.log("person", datum);
  const { data } = await helpers.save('person', datum);
  console.log('post', data);
  router.push(`/persons`);
};
</script>
