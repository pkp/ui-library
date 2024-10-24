<template>
	<ContributorsListPanel
		data-cy="contributor-manager"
		v-bind="contributorManagerStore.contributorsListPanelProps"
		class="pkpWorkflow__contributors"
	></ContributorsListPanel>
</template>

<script setup>
import {useContributorManagerStore} from './contributorManagerStore.js';
import ContributorsListPanel from '@/components/ListPanel/contributors/ContributorsListPanel.vue';
const props = defineProps({
	submission: {type: Object, required: true},
	publication: {type: Object, required: true},
	canEdit: {type: Boolean, required: true},
});

const contributorManagerStore = useContributorManagerStore(props);
</script>
