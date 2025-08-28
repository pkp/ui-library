<template>
	<TableCell>
		<Checkbox
			v-if="!hidden"
			:checked="isChecked"
			:labelled-by="labelledBy"
			:disabled="disabled"
			@change="onChange"
		></Checkbox>
	</TableCell>
</template>

<script setup>
import {ref} from 'vue';
import {useModal} from '@/composables/useModal';
import {t} from '@/utils/i18n';
import TableCell from './TableCell.vue';
import Checkbox from '@/components/Checkbox/Checkbox.vue';

const props = defineProps({
	checked: {type: Boolean, required: true},
	labelledBy: {type: String, required: true},
	disabled: {type: Boolean, required: false, default: () => false},
	hidden: {type: Boolean, default: () => false},
	confirmTitle: {type: String, default: () => ''},
	confirmMessage: {type: String, default: () => ''},
});

const emit = defineEmits(['change']);
const isChecked = ref(!!props.checked);

function onChange($event) {
	if (!props.confirmTitle || !props.confirmMessage) {
		isChecked.value = !isChecked.value;
		return emit('change', isChecked.value);
	}

	// confirm the change event before emitting
	$event.preventDefault();

	const {openDialog} = useModal();
	openDialog({
		actions: [
			{
				label: t('common.yes'),
				callback: (close) => {
					isChecked.value = !isChecked.value;
					emit('change', isChecked.value);
					close();
				},
			},
			{
				label: t('common.no'),
				isWarnable: true,
				callback: (close) => {
					$event.preventDefault();
					close();
				},
			},
		],
		title: props.confirmTitle,
		message: props.confirmMessage,
	});
}
</script>
