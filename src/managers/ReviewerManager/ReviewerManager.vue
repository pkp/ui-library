<template>
	<div>
		<div class="flex justify-between border-x border-t border-light px-3 py-4">
			<h2 :id="headingId" class="text-lg-bold text-heading">
				{{ t('dashboard.summary.reviewers') }}
			</h2>
			<div>
				<PkpButton
					v-for="action in reviewerStore.topActions"
					:key="action.name"
					@click="reviewerStore.handleAction(action.name)"
				>
					{{ action.label }}
				</PkpButton>
			</div>
		</div>
		<PkpTable
			aria-label="Example for basic table"
			:aria-describedby="headingId"
		>
			<TableHeader>
				<TableColumn>{{ t('dashboard.summary.reviewer') }}</TableColumn>
				<TableColumn v-if="!redactedForAuthors">
					{{ t('dashboard.summary.reviewerStatus') }}
				</TableColumn>
				<TableColumn>{{ t('common.type') }}</TableColumn>
				<TableColumn>{{ t('grid.columns.actions') }}</TableColumn>
				<TableColumn>
					<span class="sr-only">{{ t('common.moreActions') }}</span>
				</TableColumn>
			</TableHeader>
			<TableBody>
				<TableRow
					v-for="reviewAssignment in reviewerStore.reviewAssignments"
					:key="reviewAssignment.id"
				>
					<TableCell :is-row-header="true">
						<span class="text-base-normal">
							{{ reviewAssignment.reviewerFullName }}
						</span>
					</TableCell>
					<TableCell v-if="!redactedForAuthors">
						<span class="text-base-normal">
							{{ reviewAssignment.status }}
						</span>
					</TableCell>
					<TableCell>
						<span class="flex items-center space-x-2">
							<Icon
								v-for="icon in reviewerStore.getReviewMethodIcons(
									reviewAssignment,
								)"
								:key="icon"
								class="h-5 w-5"
								:icon="icon"
							/>
						</span>
					</TableCell>
					<ReviewerManagerCellPrimaryActions
						:review-assignment="reviewAssignment"
						:submission="submission"
					></ReviewerManagerCellPrimaryActions>
					<ReviewerManagerCellActions
						:review-assignment="reviewAssignment"
						:submission="submission"
					></ReviewerManagerCellActions>
				</TableRow>
			</TableBody>
		</PkpTable>
	</div>
</template>

<script setup>
import PkpTable from '@/components/TableNext/Table.vue';
import TableColumn from '@/components/TableNext/TableColumn.vue';
import TableHeader from '@/components/TableNext/TableHeader.vue';
import TableBody from '@/components/TableNext/TableBody.vue';
import TableRow from '@/components/TableNext/TableRow.vue';
import TableCell from '@/components/TableNext/TableCell.vue';
import ReviewerManagerCellPrimaryActions from './ReviewerManagerCellPrimaryActions.vue';
import ReviewerManagerCellActions from './ReviewerManagerCellActions.vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';

import {useReviewerManagerStore} from './reviewerManagerStore.js';
import {useId} from '@/composables/useId.js';
import {useLocalize} from '@/composables/useLocalize.js';

const {generateId} = useId();
const {t} = useLocalize();
const headingId = generateId();

const props = defineProps({
	submission: {type: Object, required: true},
	reviewRoundId: {type: Number, required: true},
	redactedForAuthors: {type: Boolean, required: false, default: false},
});

const reviewerStore = useReviewerManagerStore(props);
</script>
./ReviewerManagerCellActions.vue
