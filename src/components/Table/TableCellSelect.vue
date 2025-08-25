<template>
	<TableCell>
		<label
			v-if="visible"
			class="inline-flex select-none items-center text-primary"
			:class="{'cursor-pointer': !disabled}"
		>
			<input
				type="checkbox"
				class="peer sr-only"
				:checked="isChecked"
				:aria-labelledby="props.labelledBy"
				:disabled="disabled"
				@click="onClick"
			/>
			<span class="relative mr-2 flex h-5 w-5 items-center justify-center">
				<Icon :icon="icon" class="h-5 w-5"></Icon>
			</span>
		</label>
	</TableCell>
</template>

<script setup>
import {ref, computed} from 'vue';
import {useModal} from '@/composables/useModal';
import {t} from '@/utils/i18n';
import TableCell from './TableCell.vue';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	checked: {type: Boolean, required: true},
	labelledBy: {type: String, required: true},
	disabled: {type: Boolean, required: false, default: () => false},
	visible: {type: Boolean, default: () => true},
	confirmTitle: {type: String, default: () => ''},
	confirmMessage: {type: String, default: () => ''},
});

const emit = defineEmits(['change']);
const isChecked = ref(!!props.checked);
const icon = computed(() => (isChecked.value ? 'CheckboxTicked' : 'Checkbox'));

function onClick($event) {
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
