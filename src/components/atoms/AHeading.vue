<template>
  <component :is="as" :class="['a-heading','h2','typo-appear', tone==='navy'?'text-navy':'text-purple']"><slot /></component>
</template>
<script setup lang="ts">defineProps<{ as?:string; tone?: 'navy'|'purple' }>()</script>
<style scoped>.a-heading{line-height:1.2;font-weight:800}.text-navy{color:#002772}.text-purple{color:#720060}</style>
