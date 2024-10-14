<template>
	<div class="counterReportsListPanel">
		<slot>
			<ListPanel :items="items">
				<template #header>
					<PkpHeader>
						<h2>{{ title }}</h2>
						<Spinner v-if="isLoadingItems" />
					</PkpHeader>
				</template>
				<template #item-title="{item}">
					<span :id="item.Report_ID" class="text-lg-normal">
						{{ item.Report_Name }} ({{ item.Report_ID }})
					</span>
				</template>
				<template #item-actions="{item}">
					<PkpButton @click="openEditModal(item.Report_ID)">
						{{ t('common.edit') }}
					</PkpButton>
				</template>
			</ListPanel>
		</slot>
	</div>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import PkpHeader from '@/components/Header/Header.vue';
import cloneDeep from 'clone-deep';
import CounterReportsEditModal from './CounterReportsEditModal.vue';
import {useModal} from '@/composables/useModal';
import {useFetch} from '@/composables/useFetch';
import {useApiUrl} from '@/composables/useApiUrl';
import {useLocalize} from '@/composables/useLocalize';
import {ref, computed} from 'vue';

const {t} = useLocalize();

const props = defineProps({
	form: {type: Object, required: true},
	id: {type: String, required: true},
	title: {type: String, required: true},
});

const items = computed(() => data.value || []);
const activeForm = ref(null);
const activeFormTitle = ref('');

const {apiUrl} = useApiUrl(`stats/sushi/reports`);
const {
	data,
	fetch,
	isLoading: isLoadingItems,
} = useFetch(apiUrl, {
	method: 'GET',
});
fetch();

/**
 * Open the modal to edit an item
 *
 * @param {String} id
 */
function openEditModal(id) {
	const report = items.value.find((report) => report.Report_ID === id);

	activeForm.value = cloneDeep(props.form);
	activeForm.value.method = 'GET';
	activeForm.value.fields = activeForm.value.reportFields[id];

	activeFormTitle.value = t('manager.statistics.counterR5Report.settings');

	const {openSideModal} = useModal();
	const {apiUrl} = useApiUrl(`stats/sushi/${report.Path}`);

	openSideModal(CounterReportsEditModal, {
		title: t('manager.statistics.counterR5Report.settings'),
		submitAction: apiUrl,
		activeForm,
	});
}
</script>
