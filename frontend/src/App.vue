<template>
  <guideTour />
  <Login
    v-if="tela === 'login'"
    @irCadastro="tela = 'cadastro'"
    @logado="irDashboard"
  />

  <Cadastro
    v-else-if="tela === 'cadastro'"
    @voltar="tela = 'login'"
  />

  <div v-else-if="tela === 'dashboard'" class="layout">

    <div id="section-header">
      <Header />
    </div>

    <div class="main">
      <Sidebar />

      <div id="section-body" class="content-area">
        <HelloWorld />

        <div id="section-users" class="user-list-wrap">
          <UserList />
        </div>

        <FooterComponent />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Login           from './components/login.vue'
import Cadastro        from './components/cadastro.vue'
import Header          from './components/Header.vue'
import Sidebar         from './components/Sidebar.vue'
import HelloWorld      from './components/HelloWorld.vue'
import UserList        from './components/UserList.vue'
import FooterComponent from './components/FooterComponent.vue'
import guideTour from './components/guide-tour.vue'

const savedToken   = sessionStorage.getItem('token')
const savedUserRaw = sessionStorage.getItem('user')

let isLoggedIn = false
if (savedToken && savedUserRaw) {
  try {
    const parsed = JSON.parse(savedUserRaw)
    isLoggedIn = !!(parsed && parsed.email)
  } catch {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  }
}

const tela = ref(isLoggedIn ? 'dashboard' : 'login')

const irDashboard = (userData) => {
  sessionStorage.setItem('user', typeof userData === 'string'
    ? userData
    : JSON.stringify(userData))
  tela.value = 'dashboard'
}
</script>

<style>
*, *::before, *::after { box-sizing: border-box; }

html, body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  font-family: 'Georgia', serif;
  background: #111827;
  color: #e8e8e8;
  overflow: hidden;
}

.layout {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: #151e31;
}

.user-list-wrap {
  padding: 0 2rem 1rem;
}

html { scroll-behavior: smooth; }
</style>
