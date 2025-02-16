<template>
	<h1 class="app__pageHeading">
		{{ t('manager.statistics.counterR5Reports') }}
	</h1>
	<p
		v-strip-unsafe-html="t('manager.statistics.counterR5Reports.description')"
	/>
	<div class="mb-4">
		<Notification v-if="usageNotPossible" type="warning">
			{{ t('manager.statistics.counterR5Reports.usageNotPossible') }}
		</Notification>
	</div>
	<Panel>
		<PanelSection>
			<CounterReportsListPanel v-bind="counterReportsListPanel" @set="set" />
		</PanelSection>
	</Panel>
</template>

<script setup>
import Panel from '@/components/Panel/Panel.vue';
import PanelSection from '@/components/Panel/PanelSection.vue';
import CounterReportsListPanel from './components/CounterReportsListPanel.vue';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

defineProps({
	counterReportsListPanel: {type: Object, required: true},
	usageNotPossible: {type: Boolean, required: true},
});
</script>
