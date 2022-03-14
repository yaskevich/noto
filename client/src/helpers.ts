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

const formatDate = (x: any) => {
  if (x) {
    // return new Date(x)
    var d = x.getDate();
    var m = x.getMonth() + 1; //Month from 0 to 11
    var y = x.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
  }
};

export default {
  html,
  renderDate,
  formatDate,
};
