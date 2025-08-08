<template>
	<AcceptInvitationFormDisplayItemBasic
		:heading-element="headingElement"
		:heading="field.label"
		:value="displayLocale ? field.value[displayLocale] : field.value"
	/>
</template>

<script setup>
import AcceptInvitationFormDisplayItemBasic from './AcceptInvitationFormDisplayItemBasic.vue';

defineProps({
	field: {type: Object, required: true},
	headingElement: {required: true, type: String},
	displayLocale: {required: true, type: String, default: ''},
});
</script>
