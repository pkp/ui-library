<template>
	<span class="BaseCommentsMessageAuthorName">
		{{ messageProps.message.userName }}
	</span>
</template>
<script setup>
import {inject} from 'vue';

const messageProps = inject('messageProps');
</script>
