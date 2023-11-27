<template>
	<SideModalBody>
		<template #header>
			<h2>{{ t('common.filter') }}</h2>
		</template>
		<Panel>
			<PanelSection>
				<PkpForm
					v-bind="filtersForm"
					@set="(formId, data) => updateFiltersForm(data)"
				></PkpForm>
				<div class="mt-2 flex gap-2">
					<PkpButton @click="applyFilters()">Apply Filters</PkpButton>
					<PkpButton @click="clearFiltersForm()">Clear Filters</PkpButton>
				</div>
			</PanelSection>
		</Panel>
	</SideModalBody>
</template>

<script>
import {inject} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import Panel from '@/components/Panel/Panel.vue';
import PanelSection from '@/components/Panel/PanelSection.vue';
import PkpButton from '@/components/Button/Button.vue';
import PkpForm from '@/components/Form/Form.vue';

import {useFiltersForm} from '@/composables/useFiltersForm';
export default {
	components: {SideModalBody, Panel, PanelSection, PkpButton, PkpForm},
	props: {
		filtersFormInitial: {type: Object, required: true},
	},
	emits: ['updateFiltersForm'],
	setup(props, {emit}) {
		// clone current filtersForm, so its independent until its saved
		const filtersFormCopy = JSON.parse(
			JSON.stringify(props.filtersFormInitial),
		);

		// handling filtersForm
		const {filtersForm, updateFiltersForm, clearFiltersForm} =
			useFiltersForm(filtersFormCopy);

		const closeModal = inject('closeModal');

		function applyFilters() {
			emit('updateFiltersForm', filtersForm.value);
			closeModal();
		}

		return {filtersForm, updateFiltersForm, clearFiltersForm, applyFilters};
	},
};
</script>
