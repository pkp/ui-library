<template>
	<div>
		<h3 class="font-bold leading-6">
			{{ t('submission.citations.structured') }}
		</h3>
		<div class="py-4 leading-8">
			{{
				t('submission.citations.structured.citationsMetadataLookup.description')
			}}
		</div>
		<div>
			<Checkbox
				id="citations-citationsMetadataLookup"
				:label="
					t('submission.citations.structured.enableCitationsMetadataLookup')
				"
				:checked="isChecked"
				:disabled="!citationStore.canEditPublication"
				:labelled-by="''"
				@change="onChange"
			/>
		</div>
	</div>
</template>

<script setup>
import {ref} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useCitationManagerStore} from './citationManagerStore.js';
import Checkbox from '@/components/Checkbox/Checkbox.vue';
import {useModal} from '@/composables/useModal';

const {t} = useLocalize();

const props = defineProps({
	checked: {type: Boolean, required: true},
});

const citationStore = useCitationManagerStore();

const emit = defineEmits(['change']);
const isChecked = ref(!!props.checked);

function onChange($event) {
	// confirm before emitting
	$event.preventDefault();

	const {openDialog} = useModal();
	openDialog({
		title: citationStore.citationsMetadataLookup
			? t('submission.citations.structured.enableModal.title')
			: t('submission.citations.structured.disableModal.title'),
		message: citationStore.citationsMetadataLookup
			? t('submission.citations.structured.enableModal.confirm')
			: t('submission.citations.structured.disableModal.confirm'),
		modalStyle: 'negative',
		actions: [
			{
				label: t('common.ok'),
				isPrimary: true,
				callback: async (close) => {
					isChecked.value = !isChecked.value;
					emit('change', isChecked.value);
					close();
				},
			},
			{
				label: t('common.cancel'),
				isSecondary: true,
				callback: (close) => {
					$event.preventDefault();
					close();
				},
			},
		],
		close: () => {},
	});
}
</script>
