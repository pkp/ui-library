<template>
	<DialogBody :is-loading="isLoading">
		<div
			v-strip-unsafe-html="
				t('manager.category.delete.message.body', {
					title,
					subCategoryCount,
				})
			"
		></div>

		<FieldText
			class="mt-8"
			size="large"
			:value="inputValue"
			@input="inputValue = $event.target.value"
		/>
		<template #actions>
			<PkpButton
				:disabled="inputValue !== title"
				is-primary
				@click="confirmInput"
			>
				{{ t('manager.category.confirmDelete') }}
			</PkpButton>
			<PkpButton :is-warnable="true" @click="closeModal">
				{{ t('common.cancel') }}
			</PkpButton>
		</template>
	</DialogBody>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';
import DialogBody from '@/components/Modal/DialogBody.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import {useLocalize} from '@/composables/useLocalize';
import {ref} from 'vue';

const {t} = useLocalize();

const inputValue = ref('');
const isLoading = ref(false);
const props = defineProps({
	/**
	 * Function to be executed when the user confirms the deletion.
	 */
	onConfirm: {
		type: Function,
		required: true,
	},
	/**
	 * Function to be executed when the dialog is closed.
	 */
	onClose: {
		type: Function,
		required: false,
	},
	/**
	 * Title of the category to be deleted. Displayed in the dialog message
	 * and used as the required input for confirming the deletion.
	 */
	title: {
		type: String,
		required: true,
	},
	/**
	 * The number of subcategories that will be deleted along with the category. Used in message displayed in dialog body.
	 */
	subCategoryCount: {
		type: Number,
		required: true,
	},
});

/**
 * Function to confirm the deletion of the category. It checks if the input value
 * matches the category title and then calls the onConfirm function.
 */
async function confirmInput() {
	if (inputValue.value !== props.title) {
		return;
	}

	isLoading.value = true;
	await props.onConfirm();
	closeModal();
}

function closeModal() {
	props.onClose?.();
}
</script>
