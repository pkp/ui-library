<template>
	<SideModalBody>
		<template #header>
			<h2>{{ t('common.filter') }}</h2>
		</template>
		<Panel>
			<PanelSection>
				<pkp-form
					v-bind="filtersForm"
					@set="(...args) => $emit('set', ...args)"
					@success="(...args) => $emit('success', ...args)"
				></pkp-form>
			</PanelSection>
		</Panel>
	</SideModalBody>
</template>

<script>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import Panel from '@/components/Panel/Panel.vue';
import PanelSection from '@/components/Panel/PanelSection.vue';

export default {
	components: {SideModalBody, Panel, PanelSection},
	props: {
		filtersForm: {type: Object, required: true},
	},
	emits: ['set', 'success'],
};
</script>
