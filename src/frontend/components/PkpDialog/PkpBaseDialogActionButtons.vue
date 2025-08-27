<template>
	<div>
		<PkpButton
			v-for="action in dialogProps.actions"
			:key="action.label"
			:href="action.href || null"
			:is-primary="action.isPrimary || null"
			:is-secondary="action.isSecondary || null"
			@click="action.callback ? fireCallback(action.callback) : null"
		>
			{{ action.label }}
		</PkpButton>
	</div>
</template>
<script setup>
import {inject} from 'vue';
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';

const dialogProps = inject('dialogProps');
const fireCallback = inject('fireCallback');
</script>
