<template>
  <main class="container">
    <section class="login-section">
      <form class="form-login" @submit.prevent="handleCadastro">
        <h2>Criar Conta</h2>

        <input v-model="name"     class="input" type="text"     placeholder="Nome"  required />
        <input v-model="cpf"      class="input" type="text"     placeholder="CPF"   required />
        <input v-model="email"    class="input" type="email"    placeholder="Email" required />
        <input v-model="password" class="input" type="password" placeholder="Senha" required />

        <div class="buttons">
          <button class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
          </button>
          <button type="button" class="btn btn-secondary" @click="emit('voltar')">
            Voltar
          </button>
        </div>

        <div class="divider">ou</div>

        <button type="button" class="btn-google" @click="cadastroGoogle">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Cadastrar com Google
        </button>
      </form>

      <div v-if="msg" :class="['msg', tipoMsg]">{{ msg }}</div>
    </section>

    <section class="banner" :style="{ backgroundImage: `url(${heroBg})` }"></section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import heroBg from "@/assets/hero.png";

const emit = defineEmits(["voltar"]);

const name     = ref("");
const cpf      = ref("");
const email    = ref("");
const password = ref("");
const msg      = ref("");
const tipoMsg  = ref("");
const loading  = ref(false);

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let dig1 = 11 - (soma % 11);
  if (dig1 >= 10) dig1 = 0;
  if (dig1 != parseInt(cpf.charAt(9))) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  let dig2 = 11 - (soma % 11);
  if (dig2 >= 10) dig2 = 0;
  return dig2 === parseInt(cpf.charAt(10));
};

const mostrarMsg = (texto, tipo) => { msg.value = texto; tipoMsg.value = tipo; };

const handleCadastro = async () => {
  if (name.value.length < 3) return mostrarMsg("Nome muito curto", "erro");
  if (!validarCPF(cpf.value)) return mostrarMsg("CPF inválido", "erro");
  loading.value = true;
  try {
    await axios.post(`${API}/users/register`, {
      name: name.value, cpf: cpf.value, email: email.value, password: password.value,
    });
    mostrarMsg("Cadastro realizado 🎉", "sucesso");
    setTimeout(() => emit("voltar"), 1200);
  } catch (error) {
    mostrarMsg(error.response?.data?.message || "Erro ao cadastrar ❌", "erro");
  } finally {
    loading.value = false;
  }
};

// ✅ Mesmo fluxo do login — callback vai pro backend
const cadastroGoogle = () => {
  window.location.href = `${API}/users/auth/google`
}
</script>