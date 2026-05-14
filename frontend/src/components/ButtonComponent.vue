<template>
<button @click="$emit('click')">
{{ label }}
</button>
</template>

<script>
export default{
props:["label"]
}
</script>

<style>
button{
background:#3498db;
color:white;
border:none;
padding:10px 15px;
border-radius:5px;
cursor:pointer;
}
</style>