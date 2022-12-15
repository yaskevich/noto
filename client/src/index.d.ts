import { StyleValue } from 'vue';

import type CalendarValueType from 'primevue/calendar';

declare global {
  interface keyable {
    [key: string]: any;
  }

  interface IItem {
    title: string;
    year: string;
    meta: string;
    type: string;
    time: string;
    date: Date;
    content: string;
  }

  interface IPerson {
    name: string;
    bday: Date;
    content: Object;
    id: number;
  }
  interface ICat {
    title: string;
    id: number;
  }
  interface IPost {
    title: string;
    id: number;
    date: Date;
    content: Object;
    time: string;
    deleted: boolean;
  }
}
