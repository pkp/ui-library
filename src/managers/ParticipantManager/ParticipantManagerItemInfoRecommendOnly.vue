<template>
	<div class="mt-0.5 text-xs-normal text-heading">
		{{ t('participantManager.onlyAllowedToRecommend') }}
	</div>
</template>

<script setup>
defineProps({participant: {type: Object, required: true}});
</script>
