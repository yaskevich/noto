import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { generateHTML } from '@tiptap/core';
import { useEditor, } from '@tiptap/vue-3';
import Placeholder from '@tiptap/extension-placeholder';

const html = (x: any) =>
  x && x !== '""' ? generateHTML(typeof x === 'string' ? JSON.parse(x) : x, [StarterKit, Link]) : '';

const ms = [
  '⛄', // january
  '❄️', // februrary
  '☂️', // march
  '🐤', // april
  '🌳', // may
  '🍋', // june
  '🍊', // july
  '🍎', // august
  '🐓', // september
  '🎃', // october
  '☔', // november
  '🎄', // december
];


const renderDate = (x: any) => {
  const num = Number(x);
  // if (x) {
  const utc = new Date(num ? num : x);
  // const offset = utc.getTimezoneOffset();
  // const local = new Date(utc.getTime() - (num ? 0 : offset * 60000));
  const local = new Date(utc.getTime());
  return local.toLocaleString('en-UK').split('/').join('.').replace(',', '').slice(0, -3);
  // }
};

const formatDate = (x: any) => {
  if (x) {
    // return new Date(x)
    var d = x.getDate();
    var m = x.getMonth() + 1; //Month from 0 to 11
    var y = x.getFullYear();
    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
  }
};

const setupEditor = (content: string) =>
  useEditor({
    content: content,
    extensions: [
      StarterKit,
      Link,
      Placeholder.configure({
        placeholder: 'Write something',
        showOnlyWhenEditable: false,
        showOnlyCurrent: false,
      }),
    ],
  });

export default {
  html,
  renderDate,
  formatDate,
  setupEditor,
  months: ms,
};
