<template>
	<span class="BaseCommentsMessageAuthorAffiliation">
		{{ messageProps.message.userAffiliation }}
	</span>
</template>
<script setup>
import {inject} from 'vue';

const messageProps = inject('messageProps');
</script>
