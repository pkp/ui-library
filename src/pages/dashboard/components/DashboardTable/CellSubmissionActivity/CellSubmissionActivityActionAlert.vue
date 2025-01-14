<template>
	<div class="flex items-center gap-x-2">
		<div v-if="alert">{{ alert }}</div>
		<PkpButton v-if="actionName" size-variant="compact" @click="handleAction">
			{{ actionLabel }}
		</PkpButton>
	</div>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';
import {useDashboardPageStore} from '@/pages/dashboard/dashboardPageStore';

const props = defineProps({
	alert: {type: String, required: false, default: null},
	actionLabel: {type: String, required: false, default: null},
	actionName: {type: String, required: false, default: null},
	actionArgs: {type: String, required: false, default: () => {}},
});

const dashboardStore = useDashboardPageStore();

function handleAction() {
	dashboardStore[props.actionName](props.actionArgs);
}
</script>
