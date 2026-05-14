<template>
  <nav class="sidebar">
    <ul class="menu">
      <li
        v-for="(item, i) in items"
        :key="item.id"
        :class="['item', { active: activeStep === i }]"
        @click="ir(item.id, i)"
      >
        <span class="emoji">{{ item.emoji }}</span>
        <span class="label">{{ item.label }}</span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const activeStep = ref(0)

const items = [
  { id: 'section-header', emoji: '🏠', label: 'Header'  },
  { id: 'section-body',   emoji: '📄', label: 'Body'    },
  { id: 'section-card',   emoji: '👋', label: 'Hello'   },
  { id: 'section-footer', emoji: '📌', label: 'Footer'  },
]

const ir = (id, index) => {
  activeStep.value = index
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.sidebar {
  width: 180px;
  min-width: 180px;
  background: #1e293b;
  border-right: 1px solid #334155;
  padding: 16px 12px;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.18s ease;
  font-family: sans-serif;
  font-size: 0.88rem;
  color: #94a3b8;
}

.item:hover {
  background: #273549;
  color: #f1f5f9;
}

.item.active {
  background: #1d3a5f;
  border-color: #3b82f6;
  color: #60a5fa;
  font-weight: 600;
}

.emoji {
  font-size: 1.1rem;
}
</style>