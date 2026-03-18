<template>
	<SideModalBody>
		<template #title>{{ title }}</template>
		<SideModalLayoutBasic>
			<div v-if="isLoading" class="flex items-center gap-2 p-16">
				<Spinner />
				{{ t('common.loading') }}
			</div>
			<PkpForm v-else v-bind="form" @set="set" @success="formSuccess" />
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import {watch, inject} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import {useForm} from '@/composables/useForm';
import {useFetch} from '@/composables/useFetch';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

const props = defineProps({
	title: {type: String, required: true},
	formConfig: {type: Object, required: true},
	/** GET endpoint to fetch fresh field values each time the modal opens */
	getApiUrl: {type: String, default: null},
});

const {form, set, setValues} = useForm(props.formConfig);
const closeModal = inject('closeModal');

const {data, isLoading, fetch: fetchData} = useFetch(props.getApiUrl);
watch(data, (newData) => {
	if (newData) {
		setValues(newData);
	}
});
if (props.getApiUrl) {
	fetchData();
}

function formSuccess() {
	closeModal();
}
</script>
