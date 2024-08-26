<template>
	<h1 class="app__pageHeading">
		{{ title }}
	</h1>
	<p v-html="description" />
	<Notification
		v-if="usageNotPossible"
		type="warning"
		class="pkpNotification--backendPage__header"
	>
		{{ t('manager.statistics.counterR5Reports.usageNotPossible') }}
	</Notification>
	<Panel>
		<PanelSection>
			<CounterReportsListPanel v-bind="counterReportsListPanel" @set="set" />
		</PanelSection>
	</Panel>
</template>

<script setup>
import Panel from '@/components/Panel/Panel.vue';
import PanelSection from '@/components/Panel/PanelSection.vue';
import CounterReportsListPanel from '@/components/ListPanel/counter/CounterReportsListPanel.vue';

defineProps({
	counterReportsListPanel: {type: Array, required: true},
	usageNotPossible: {type: Boolean, required: true},
	title: {type: String, required: true},
	description: {type: String, required: true},
});
</script>
