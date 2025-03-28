<template>
  <div id="app">
    <nav>
      <router-link to="/doctor">Horario del Médico</router-link>
      <router-link to="/admin">Vista de la Secretaria</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style>
nav {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 10px;
  background: #2c3e50;
}
nav a {
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 5px;
}
nav a:hover {
  background: #1a252f;
}
</style>
