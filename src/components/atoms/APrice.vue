<template><span :class="['a-price', tone==='navy'?'text-navy':'text-purple']">$ {{ value.toFixed(2) }}</span></template>
<script setup lang="ts">defineProps<{ value:number; tone?: 'navy'|'purple' }>()</script>
<style scoped>.a-price{font-size:22px;font-weight:800}.text-navy{color:#002772}.text-purple{color:#720060}</style>
