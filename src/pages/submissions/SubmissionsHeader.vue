<template>
	<div class="submissions__list__top">
		<pkp-button element="a" href="{url page='submission'}">
			{{ t('manager.newSubmission') }}
		</pkp-button>
	</div>
	<h2 class="submissions__list__title" id="table-title">
		{{ submissionsStore.currentView.name }}
		<span class="submissions__view__count">
			{{ submissionsStore.submissionsCount }}
		</span>
	</h2>
</template>

<script>
import {mapStores} from 'pinia';
import {useSubmissionsStore} from '@/pages/submissions/submissionsStore';

export default {
	computed: {...mapStores(useSubmissionsStore)},
};
</script>
