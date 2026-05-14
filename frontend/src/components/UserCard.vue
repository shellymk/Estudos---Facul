<template>
<div class="card">
<h3>{{ name }}</h3>
<p>{{ role }}</p>
</div>
</template>

<UserCard name="Ana" role="Aluno"/>

<UserCard name="Carlos" role="Professor"/>

<script>
export default {
props:["name","role"]
}
</script>

<style>
.card{
border:1px solid #ddd;
padding:15px;
border-radius:8px;
margin:10px;
}
</style>