<template>
	<DialogBody :is-loading="isLoading">
		<div
			v-strip-unsafe-html="
				t('manager.contributorRoles.alert.delete.message.body', {
					contributorRoleIdentifier: contributorRoleIdentifier,
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
				:disabled="inputValue !== contributorRoleIdentifier"
				is-primary
				@click="confirmInput"
			>
				{{ t('common.confirmDelete') }}
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
	 * Identifier of the contributor role to be deleted. Displayed in the dialog message
	 * and used as the required input for confirming the deletion.
	 */
	contributorRoleIdentifier: {
		type: String,
		required: true,
	},
});

/**
 * Function to confirm the deletion of the role. It checks if the input value
 * matches the role identifier and then calls the onConfirm function.
 */
async function confirmInput() {
	if (inputValue.value !== props.contributorRoleIdentifier) {
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
