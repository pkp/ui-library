<template>
	<div data-cy="reviewer-recommendation-manager">
		<PkpTable :show-spinner="store.isRecommendationsLoading">
			<template #label>
				<h3 class="text-3xl-bold">
					{{ title }}
				</h3>
			</template>

			<template #top-controls>
				<div class="flex space-x-2">
					<PkpButton @click="openAddModal">
						{{ t('grid.action.addReviewerRecommendation') }}
					</PkpButton>
				</div>
			</template>

			<TableHeader>
				<TableColumn>
					{{ t('manager.reviewerRecommendations.list.name.title') }}
				</TableColumn>
				<TableColumn>
					{{ t('manager.reviewerRecommendations.list.status.title') }}
				</TableColumn>
				<TableColumn></TableColumn>
			</TableHeader>

			<TableBody>
				<TableRow v-for="item in store.items" :key="item.id">
					<TableCell :is-row-header="true">
						<span class="text-lg-normal">{{ localize(item.title) }}</span>
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
							:label="t('common.moreActions')"
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

const props = defineProps({
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
