<template>
	<div data-cy="reviewer-recommendation-manager">
		<PkpTable>
			<template #label>
				<h3 class="text-3xl-bold">
					{{ title }}
				</h3>
			</template>

			<template #top-controls>
				<div class="flex space-x-2">
					<PkpButton @click="openAddModal">
						{{ addRecommendationLabel }}
					</PkpButton>
				</div>
			</template>

			<TableHeader>
				<TableColumn>{{ recommendationNameTitle }}</TableColumn>
				<TableColumn>{{ recommendationStatusTitle }}</TableColumn>
				<TableColumn></TableColumn>
			</TableHeader>

			<TableBody>
				<TableRow v-for="item in store.items" :key="item.id">
					<TableCell :is-row-header="true">
						<span
							v-strip-unsafe-html="escapeHtml(localize(item.title))"
							class="text-lg-normal"
						></span>
					</TableCell>

					<TableCell>
						<label>
							<input
								type="checkbox"
								:name="`recommendation_status[]`"
								:value="item.id"
								:checked="item.status"
								class="text-blue-900 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-5 w-5 rounded focus:ring-2"
								@click.prevent="(event) => handleStatusToggle(item, event)"
							/>
						</label>
					</TableCell>

					<TableCell>
						<DropdownActions
							v-if="item.removable"
							:actions="getActions(item)"
							:label="t('reviewer.recommendation.management.options')"
							button-variant="ellipsis"
							direction="left"
							@action="(actionName) => handleAction(actionName, item)"
						/>
					</TableCell>
				</TableRow>
			</TableBody>
		</PkpTable>
	</div>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import {useReviewerRecommendationManagerStore} from './reviewerRecommendationManagerStore';
import PkpTable from '@/components/Table/Table.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';
import PkpButton from '@/components/Button/Button.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {escapeHtml} from '@/directives/stripUnsafeHtml';

const props = defineProps({
	addRecommendationLabel: {type: String, required: true},
	confirmDeleteMessage: {type: String, required: true},
	deleteRecommendationLabel: {type: String, required: true},
	editRecommendationLabel: {type: String, required: true},
	activateTitle: {type: String, required: true},
	confirmActivateMessage: {type: String, required: true},
	deactivateTitle: {type: String, required: true},
	confirmDeactivateMessage: {type: String, required: true},
	recommendationNameTitle: {type: String, required: true},
	recommendationStatusTitle: {type: String, required: true},
	apiUrl: {type: String, required: true},
	form: {type: Object, required: true},
	id: {type: String, required: true},
	title: {type: String, required: true},
});

const {t, localize} = useLocalize();
const store = useReviewerRecommendationManagerStore(props);

// Actions handling
function getActions(item) {
	const actions = [
		{
			label: t('common.edit'),
			name: 'openEditModal',
			icon: 'Edit',
		},
	];

	if (item.removable) {
		actions.push({
			label: t('common.delete'),
			name: 'openDeleteModal',
			icon: 'Cancel',
			isWarnable: true,
		});
	}

	return actions;
}

function handleAction(actionName, item) {
	if (actionName === 'openEditModal') {
		openEditModal(item);
	} else if (actionName === 'openDeleteModal') {
		openDeleteModal(item);
	}
}

function openAddModal() {
	store.handleAdd();
}

function openEditModal(item) {
	store.handleEdit(item);
}

async function handleStatusToggle(item, event) {
	await store.handleStatusToggle(item, event);
}

async function openDeleteModal(item) {
	await store.handleDelete(item);
}
</script>
