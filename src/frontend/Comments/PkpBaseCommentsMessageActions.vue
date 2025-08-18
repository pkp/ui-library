<template>
	<DropdownActions button-variant="ellipsis" :items="items" />
</template>
<script setup>
import {ref} from 'vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

const items = ref([]);
</script>
