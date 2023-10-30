<template>
	<div class="submissions__list__top">
		<pkp-button element="a" href="{url page='submission'}">
			{{ t('manager.newSubmission') }}
		</pkp-button>
	</div>
	<h2 class="submissions__list__title" id="table-title">
		{{ $store.submissions.currentView.name }}
		<span class="submissions__view__count">
			{{ $store.submissions.submissionsCount }}
		</span>
	</h2>
</template>

<script>
export default {};
</script>
