<template>
	<Dropdown
		class="pkpWorkflow__submissionPayments"
		has-dropdown-icon
		:label="t('common.payments')"
	>
		<PkpForm v-if="paymentForm" v-bind="paymentForm" @set="set" />
	</Dropdown>
</template>

<script setup>
import {computed, watch} from 'vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import PkpForm from '@/components/Form/Form.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';

const {t} = useLocalize();

const props = defineProps({submission: {type: Object, required: true}});

const relativeUrl = computed(() => {
	// this form is not related only to submission, not publication
	return `submissions/${props.submission.id}/publications/${props.submission.publications[0].id}/_components/submissionPayment`;
});

const {apiUrl: publicationFormUrl} = useUrl(relativeUrl);
const {data: paymentForm, fetch: fetchForm} = useFetch(publicationFormUrl);

watch(
	publicationFormUrl,
	(newRelativeUrl, prevRelativeUrl) => {
		if (newRelativeUrl !== prevRelativeUrl) {
			fetchForm();
		}
	},
	{immediate: true},
);
</script>
<style lang="less">
.pkpWorkflow__submissionPayments .pkpDropdown__content {
	min-width: 15em;
	max-width: 15em;
}
</style>
