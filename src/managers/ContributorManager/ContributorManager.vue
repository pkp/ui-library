<template>
	<ListPanel :items="contributorManagerStore.contributors">
		<template #header>
			<h2 class="text-lg-bold text-heading">
				<span>{{ title }}</span>
			</h2>
		</template>
		<template #item="{item}">
			<div class="text-lg-medium">{{ item.fullName }}</div>
			<div class="text-base-normal text-secondary">
				{{ localize(item.userGroupName) }}
			</div>
		</template>
	</ListPanel>
</template>
<script setup>
import {inject} from 'vue';
import {useLocalize} from '@/composables/useLocalize.js';
import {useContributorManagerStore} from './contributorManagerStore.js';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
const props = defineProps({
	namespace: {type: String, required: true},
	submissionId: {type: String, required: true},
	publicationId: {type: String, required: true},
	title: {type: String, required: true},
});

const {localize} = useLocalize();

const contributorManagerStore = useContributorManagerStore(
	props,
	props.namespace,
);

const registerDataChangeCallback = inject('registerDataChangeCallback');
registerDataChangeCallback(() => contributorManagerStore.fetchContributors());
</script>
