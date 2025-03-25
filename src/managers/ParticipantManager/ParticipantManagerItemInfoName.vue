<template>
	<div class="break-words text-base-bold">
		{{ participant.fullName }}
	</div>
</template>

<script setup>
defineProps({participant: {type: Object, required: true}});
</script>
