<template>
  <div id="section-card" class="wrap">
    <div class="card">
      <div class="emoji">👋</div>
      <h2>Olá, seja bem-vindo!</h2>
      <p>Hello World</p>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 3rem 2.5rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  font-family: sans-serif;
}

.emoji {
  font-size: 3rem;
  margin-bottom: 1rem;
}

h2 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  color: #f1f5f9;
  font-weight: 700;
}

p {
  margin: 0;
  font-size: 1rem;
  color: #64748b;
}
</style>