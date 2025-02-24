<template>
	<div class="text-sm-normal text-secondary">
		{{ participant.roleName }}
	</div>
</template>

<script setup>
defineProps({participant: {type: Object, required: true}});
</script>
