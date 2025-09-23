<template>
  <div id="main">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/schedule">Schedule</router-link> |
      <router-link to="/home/favs">Favs</router-link> |
      <router-link to="/persons">Persons</router-link> |
      <router-link to="/journal">Journal</router-link> |
      <router-link to="/cats">Categories</router-link> |
      <router-link to="/tags">Tags</router-link>
      <!-- <router-link to="/about">About</router-link> -->
    </div>
    <router-view :key="$route.fullPath" />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#main {
  text-align: center;
  max-width: 900px;
  margin: auto;
}

p>a {
  /* These are technically the same, but use both */
  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  /* This is the dangerous one in WebKit, as it breaks things wherever */
  word-break: break-all;
  /* Instead use this non-standard one: */
  word-break: break-word;

  /* Adds a hyphen where the word breaks, if supported (No Blink) */
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
}

/* Basic editor styles */
.editor {
  & {
    display: inline-block;
    text-align: left;
    background: lightyellow;
    min-width: 100%;
    padding: 15px;
  }

  :first-child {
    margin-top: 0;
  }

  .mention {
    background-color: #CBC3E3;
    border-radius: 0.4rem;
    box-decoration-break: clone;
    color: #8467D7;
    padding: 0.1rem 0.3rem;
    text-decoration: none;
  }
}

.ProseMirror {
  padding: 15px;

  >*+* {
    margin-top: 0.75em;
  }
}

/* Placeholder (at the top) */
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.content {
  border: 1px dashed silver;
  font-family: monospace;
}
</style>
