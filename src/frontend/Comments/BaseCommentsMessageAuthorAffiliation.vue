<template>
	<span>{{ messageProps.message.userAffiliation }}</span>
</template>
<script setup>
import {inject} from 'vue';

const messageProps = inject('messageProps');
</script>
