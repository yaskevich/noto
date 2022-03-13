import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { generateHTML } from '@tiptap/core';

const html = (x: any) =>
  x && x !== '""' ? generateHTML(typeof x === 'string' ? JSON.parse(x) : x, [StarterKit, Link]) : '';

const renderDate = (x: any) => {
  if (x) {
    return new Date(x)
      .toLocaleString('en-UK', { timeZone: 'Europe/Minsk' })
      .split('/')
      .join('.')
      .replace(',', '')
      .slice(0, -3);
  }
};



export default {
  html,
  renderDate,

};
