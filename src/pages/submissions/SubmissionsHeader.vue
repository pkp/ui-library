<template>
	<div class="flex flex-row-reverse">
		<pkp-button element="a" href="{url page='submission'}">
			{{ t('manager.newSubmission') }}
		</pkp-button>
	</div>
	<h2 id="table-title" class="flex items-center gap-4 text-5xl-bold">
		{{ `${currentView.name} (${submissionsCount})` }}
	</h2>
</template>

<script setup>
import {defineProps} from 'vue';
import PkpButton from '@/components/Button/Button.vue';

defineProps({
	currentView: {type: Object, required: true},
	submissionsCount: {type: Number, required: true},
});
</script>
