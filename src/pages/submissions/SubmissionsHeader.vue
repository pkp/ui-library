<template>
	<div class="submissions__list__top">
		<pkp-button element="a" href="{url page='submission'}">
			{{ t('manager.newSubmission') }}
		</pkp-button>
	</div>
	<h2 id="table-title" class="submissions__list__title">
		{{ currentView.name }}
		<span class="submissions__view__count">
			{{ submissionsCount }}
		</span>
	</h2>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';

export default {
	components: {
		PkpButton,
	},
	props: {
		currentView: {type: Object, required: true},
		submissionsCount: {type: Number, required: true},
	},
};
</script>
