<template>
	<SideModalBody>
		<template #header>
			<h2>{{ t('common.filter') }}</h2>
		</template>
		<Panel>
			<PanelSection>
				<pkp-form
					v-bind="filtersForm"
					@set="(formId, data) => updateFiltersForm(data)"
				></pkp-form>
				<div class="flex">
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
import {useFiltersForm} from './useFiltersForm';
export default {
	components: {SideModalBody, Panel, PanelSection},
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
		const {
			filtersForm,
			update: updateFiltersForm,
			clear: clearFiltersForm,
		} = useFiltersForm(filtersFormCopy);

		const closeModal = inject('closeModal');

		function applyFilters() {
			emit('updateFiltersForm', filtersForm.value);
			closeModal();
		}

		return {filtersForm, updateFiltersForm, clearFiltersForm, applyFilters};
	},
};
</script>
