<template>
	<div data-cy="reviewer-manager">
		<PkpTable
			aria-label="Example for basic table"
			:aria-describedby="headingId"
		>
			<template #label>
				<h3 class="">
					{{ t('dashboard.summary.reviewers') }}
				</h3>
			</template>
			<template #top-controls>
				<div class="flex space-x-2">
					<PkpButton
						v-for="action in reviewerStore.topActions"
						:key="action.name"
						@click="reviewerStore[action.name]()"
					>
						{{ action.label }}
					</PkpButton>
				</div>
			</template>
			<TableHeader>
				<TableColumn>{{ t('dashboard.summary.reviewer') }}</TableColumn>
				<TableColumn>
					{{ t('dashboard.summary.reviewerStatus') }}
				</TableColumn>
				<TableColumn>{{ t('common.type') }}</TableColumn>
				<TableColumn>{{ t('grid.columns.actions') }}</TableColumn>
				<TableColumn v-if="!redactedForAuthors">
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
					<ReviewerManagerCellStatus
						:review-assignment="reviewAssignment"
						:submission="submission"
						:redacted-for-authors="redactedForAuthors"
					></ReviewerManagerCellStatus>
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
						:redacted-for-authors="redactedForAuthors"
					></ReviewerManagerCellPrimaryActions>
					<ReviewerManagerCellActions
						v-if="!redactedForAuthors"
						:review-assignment="reviewAssignment"
						:submission="submission"
						:redacted-for-authors="redactedForAuthors"
					></ReviewerManagerCellActions>
				</TableRow>
			</TableBody>
		</PkpTable>
	</div>
</template>

<script setup>
import PkpTable from '@/components/Table/Table.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';
import ReviewerManagerCellPrimaryActions from './ReviewerManagerCellPrimaryActions.vue';
import ReviewerManagerCellActions from './ReviewerManagerCellActions.vue';
import ReviewerManagerCellStatus from './ReviewerManagerCellStatus.vue';
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
