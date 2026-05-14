<template>
  <div>
    <UserCard
      v-for="user in users"
      :key="user._id"
      :name="user.name"
      :role="user.authProvider || 'local'"
    />
    <ButtonComponent label="Adicionar usuário" @click="addUser" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import UserCard from './UserCard.vue'
import ButtonComponent from './ButtonComponent.vue'
import { getAuthHeader } from '../middlewares/authMiddleware'

const users = ref([])
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

onMounted(async () => {
  try {
    const res = await axios.get(`${API}/users/me`, { headers: getAuthHeader() })
    users.value = [res.data]
  } catch {
    // silencioso
  }
})

const addUser = () => alert('Adicionar usuário')
</script>
