<template>
  <div id="main">
    <div id="nav">
      <router-link to="/">Home</router-link> | <router-link to="/deadlines">Deadlines</router-link> |
      <router-link to="/home/favs">Favs</router-link> |
      <router-link to="/persons">Persons</router-link>
      <!-- | -->
      <!-- <router-link to="/about">About</router-link> -->
    </div>
    <router-view :key="$route.fullPath" />
  </div>
</template>

<style>
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

p > a {
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
</style>
