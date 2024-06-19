<template>
	<SideModalBody>
		<template #title>
			<h2>{{ t('common.filter') }}</h2>
		</template>
		<div class="p-4">
			<div class="bg-secondary p-4">
				<PkpForm
					v-bind="filtersForm"
					@set="(formId, data) => updateFiltersForm(data)"
				></PkpForm>
			</div>
			<div class="border-t border-light">
				<div class="bg-secondary p-4">
					<div class="mt-4 flex justify-end gap-2">
						<PkpButton @click="clearFiltersForm()">
							{{ t('dashboard.clearFilters') }}
						</PkpButton>
						<PkpButton is-primary="true" @click="applyFilters()">
							{{ t('dashboard.applyFilters') }}
						</PkpButton>
					</div>
				</div>
			</div>
		</div>
	</SideModalBody>
</template>

<script setup>
import {inject} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import PkpButton from '@/components/Button/Button.vue';
import PkpForm from '@/components/Form/Form.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useFiltersForm} from '@/composables/useFiltersForm';

const props = defineProps({
	filtersFormInitial: {type: Object, required: true},
});

const emit = defineEmits(['updateFiltersForm']);

const {t} = useLocalize();

// clone current filtersForm, so its independent until its saved
const filtersFormCopy = JSON.parse(JSON.stringify(props.filtersFormInitial));

// handling filtersForm
const {filtersForm, updateFiltersForm, clearFiltersForm} =
	useFiltersForm(filtersFormCopy);

const closeModal = inject('closeModal');

function applyFilters() {
	emit('updateFiltersForm', filtersForm.value);
	closeModal();
}
</script>
