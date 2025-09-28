import { generateHTML } from '@tiptap/core';
import { useEditor, mergeAttributes } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder, CharacterCount } from '@tiptap/extensions';
import Mention from '@tiptap/extension-mention';
import { computePosition, flip, shift } from '@floating-ui/dom';
import { posToDOMRect, VueRenderer } from '@tiptap/vue-3';
import MentionList from './views/Mentions.vue';
import { reactive } from 'vue';

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

const store = reactive({
  persons: [] as Array<IPerson>,
});

const get = async (route: string, params?: keyable) => {
  const response = await fetch(`/api/${route}?` + new URLSearchParams(params).toString());
  if (response.status === 200) {
    return await response.json();
  } else {
    console.log("fetching error");
  }
};

const save = async (route: string, params: keyable) => {
  const response = await fetch(`/api/${route}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json', // this needs to be defined
    },
    body: JSON.stringify(params),
  });
  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    console.log('fetching error');
  }
};

const del = async (route: string, params: keyable) => {
  const response = await fetch(`/api/${route}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
    },
    body: JSON.stringify(params),

  });
  if (response.status === 200) {
    const data = await response.json();
    if (data.changes === 1) {
      return true;
    } else {
      console.log("denied by server");
    }
  } else {
    console.log('fetching error');
    return false;
  }
};

const renderDate = (x: any, day = false) => {
  const num = Number(x);
  // if (x) {
  const utc = new Date(num ? num : x);
  // const offset = utc.getTimezoneOffset();
  // const local = new Date(utc.getTime() - (num ? 0 : offset * 60000));
  const local = new Date(utc.getTime());
  const arr = local.toLocaleString('en-UK').split('/').join('.').replace(',', '');
  return arr.slice(0, day ? -8 : -3);
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

const getLastMinute = (day: Date) => {
  const dd = new Date(day.toISOString());
  dd.setHours(dd.getHours() + 23);
  dd.setMinutes(dd.getMinutes() + 59);
  dd.setSeconds(dd.getSeconds() + 59);
  return dd;
};

const updatePosition = (editor: any, element: any) => {
  const virtualElement = {
    getBoundingClientRect: () => posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to),
  }

  computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = 'max-content'
    element.style.positionprofile = strategy;
    element.style.left = `${x}px`
    element.style.top = `${y}px`
  })
};

const suggestion = {
  char: '!',
  items: async ({ query }: { query: any }) => {
    const persons = await get('persons', { all: 1 });
    return persons.filter((item: any) => item.name.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5)
  },

  render: () => {
    let component: any;

    return {
      onStart: (props: any) => {
        component = new VueRenderer(MentionList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return;
        }

        component.element.style.position = 'absolute';
        document.body.appendChild(component.element);
        updatePosition(props.editor, component.element);
      },

      onUpdate(props: any) {
        component.updateProps(props);
        if (!props.clientRect) {
          return
        }
        updatePosition(props.editor, component.element);
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          component.destroy();
          return true;
        }
        return component.ref?.onKeyDown(props);
      },

      onExit() {
        component.element.remove();
        component.destroy();
      },
    }
  },
};

// const getPersonById = async (id: number) => {
//   if (!store?.persons?.length) {
//     Object.assign(store.persons, await get('persons', { all: 1 }));
//   }
//   return store.persons.find(x => x.id === id);
// };

const extensions = [
  StarterKit,
  CharacterCount,
  Placeholder.configure({
    placeholder: 'Write something',
    showOnlyWhenEditable: false,
    showOnlyCurrent: false,
  }),
  Mention.configure({
    HTMLAttributes: { class: 'mention', },
    renderText(props) {
      return `${props.node.attrs.id?.name ?? props.node.attrs.id?.id}`
    },
    renderHTML({ options, node }) {
      return [
        'a',
        mergeAttributes({ href: '/person/' + node.attrs.id }, options.HTMLAttributes),
        `${store.persons.find(x => x.id === (node.attrs.id))?.name ?? node.attrs.id}`,
      ]
    },
    suggestion,
  }),
];

const html = (x: any) =>
  x && x !== '""' ? generateHTML(typeof x === 'string' ? JSON.parse(x) : x, extensions) : '';

const setupEditor = (content: string) => useEditor({ content, extensions });

export default {
  html,
  renderDate,
  formatDate,
  setupEditor,
  months: ms,
  get,
  save,
  del,
  getLastMinute,
  suggestion,
  store,
};
