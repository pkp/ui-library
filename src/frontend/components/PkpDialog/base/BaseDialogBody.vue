<template>
	<DialogDescription as-child class="BaseDialogBody">
		<component
			:is="dialogProps.bodyComponent"
			v-if="dialogProps.bodyComponent"
			v-bind="dialogProps.bodyProps"
		/>
		<div v-else v-strip-unsafe-html="dialogProps.message" />
	</DialogDescription>
</template>
<script setup>
import {inject} from 'vue';
import {DialogDescription} from 'reka-ui';

const dialogProps = inject('dialogProps');
</script>
