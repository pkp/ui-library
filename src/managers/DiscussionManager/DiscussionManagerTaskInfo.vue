<template>
	<FormGroupHeader
		:group-id="groupId"
		:label="t('discussion.form.taskInformation')"
		:description="t('discussion.form.taskInfoDescription')"
	/>
</template>

<script setup>
import {t} from '@/utils/i18n';
import FormGroupHeader from '@/components/Form/FormGroupHeader.vue';

defineProps({
	/** The groupId to use from FormGroup component */
	groupId: {
		type: String,
		required: true,
	},
});
</script>
