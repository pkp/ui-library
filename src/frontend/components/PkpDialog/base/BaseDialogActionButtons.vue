<template>
	<div v-if="dialogProps.actions?.length" class="BaseDialogActionButtons">
		<pkp-button
			v-for="action in dialogProps.actions"
			:key="action.label"
			:href="action.href || null"
			:is-primary="action.isPrimary || null"
			:is-secondary="action.isSecondary || null"
			@click="action.callback ? fireCallback(action.callback) : null"
		>
			{{ action.label }}
		</pkp-button>
	</div>
</template>
<script setup>
import {inject} from 'vue';

const dialogProps = inject('dialogProps');
const fireCallback = inject('fireCallback');
</script>
