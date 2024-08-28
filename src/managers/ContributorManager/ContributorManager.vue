<template>
	<ContributorsListPanel
		v-bind="contributorManagerStore.contributorsListPanelProps"
		class="pkpWorkflow__contributors"
	></ContributorsListPanel>
</template>

<script setup>
import {useContributorManagerStore} from './contributorManagerStore.js';
import ContributorsListPanel from '@/components/ListPanel/contributors/ContributorsListPanel.vue';
const props = defineProps({
	submissionId: {type: Number, required: true},
	publication: {type: Object, required: true},
	contributorForm: {type: Object, required: true},
});

const contributorManagerStore = useContributorManagerStore(props);
</script>
