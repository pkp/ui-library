<template>
	<FieldOptions
		:is-required="false"
		component="field-options"
		name="reviewTypes"
		:label="t('reviewer.reviewTypes')"
		type="radio"
		:options="options"
		:all-errors="sectionErrors"
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
			:all-errors="sectionErrors"
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
			:all-errors="sectionErrors"
			@change="
				(fieldName, propName, newValue, localeKey) =>
					updateReviewDetails(index, fieldName, newValue)
			"
		/>
	</div>
</template>
<script setup>
import {defineProps, computed} from 'vue';
import FieldOptions from '@/components/Form/fields/FieldOptions.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useUserInvitationPageStore} from './UserInvitationPageStore';

const props = defineProps({
	validateFields: {type: Array, required: true},
});

const store = useUserInvitationPageStore();
const {t} = useLocalize();
const options = [
	{
		value: 'anonymus',
		label: t('reviewerInvitation.reviewTypes.anonymusAuthorOrReviewer'),
	},
	{
		value: 'disclosed',
		label: t('reviewerInvitation.reviewTypes.disclosedAuthor'),
	},
	{value: 'open', label: t('reviewerInvitation.reviewTypes.open')},
];

props.validateFields.forEach((field) => {
	store.updatePayload(field, '', false);
});

function updateReviewDetails(index, fieldName, newValue) {
	delete store.errors[fieldName];
	store.updatePayload(fieldName, newValue, false);
}

const sectionErrors = computed(() => {
	return props.validateFields.reduce((obj, key) => {
		if (store.errors[key]) {
			obj[key] = store.errors[key];
		}
		return obj;
	}, {});
});
</script>
