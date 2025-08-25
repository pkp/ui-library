<template>
	<FieldOptions
		:is-required="false"
		component="field-options"
		:all-errors="{}"
		name="reviewTypes"
		:label="t('reviewer.reviewTypes')"
		type="radio"
		:options="options"
		@change="
			(fieldName, propName, newValue, localeKey) =>
				updateReviewDetails(index, fieldName, newValue)
		"
	/>
	<div class="p-8">
		<FieldText
			name="responseDueDate"
			:label="t('reviewer.responseDueDate')"
			input-type="date"
			:is-required="true"
			value=""
			:all-errors="{}"
			@change="
				(fieldName, propName, newValue, localeKey) =>
					updateReviewDetails(index, fieldName, newValue)
			"
		/>
		<FieldText
			name="reviewDueDate"
			:label="t('reviewer.reviewDueDate')"
			input-type="date"
			:is-required="true"
			value=""
			:all-errors="{}"
			@change="
				(fieldName, propName, newValue, localeKey) =>
					updateReviewDetails(index, fieldName, newValue)
			"
		/>
	</div>
</template>
<script setup>
import {defineProps} from 'vue';
import FieldOptions from '@/components/Form/fields/FieldOptions.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useUserInvitationPageStore} from './UserInvitationPageStore';

defineProps({
	validateFields: {
		type: Array,
		default() {
			return null;
		},
	},
});

const store = useUserInvitationPageStore();
const {t} = useLocalize();
const options = [
	{value: 'anonymus', label: 'Anonymus Reviewer / Anonymus Author'},
	{value: 'disclosed', label: 'Anonymus Reviewer / Disclosed Author'},
	{value: 'open', label: 'open'},
];

function updateReviewDetails(index, fieldName, newValue) {
	store.updatePayload(fieldName, newValue, false);
}
</script>
