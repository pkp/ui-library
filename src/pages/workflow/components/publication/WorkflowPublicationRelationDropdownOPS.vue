<template>
	<Dropdown
		class="pkpWorkflow__publicationRelation"
		has-dropdown-icon
		:label="t('publication.relation')"
	>
		<PkpForm v-bind="relationForm" @set="set" />
	</Dropdown>
</template>

<script setup>
import {watch} from 'vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import PkpForm from '@/components/Form/Form.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useForm} from '@/composables/useForm';

import {useUrl} from '@/composables/useUrl';
import {useDashboardPageStore} from '@/pages/dashboard/dashboardPageStore.js';

const dashboardStore = useDashboardPageStore();

const {t} = useLocalize();

const props = defineProps({publication: {type: Object, required: true}});

const relationForm = dashboardStore.componentForms.relationForm;

const {setValue, setAction, set} = useForm(relationForm);

watch(
	props.publication,
	(newPublication) => {
		setValue('relationStatus', newPublication.relationStatus);
		setValue('vorDoi', newPublication.vorDoi);

		const {apiUrl} = useUrl(
			`submissions/${newPublication.submissionId}/publications/${newPublication.id}`,
		);
		setAction(apiUrl.value);
	},
	{immediate: true},
);
</script>
<style lang="less">
.pkpWorkflow__publicationRelation .pkpDropdown__content {
	min-width: 22em;
	max-width: 22em;
}
</style>
