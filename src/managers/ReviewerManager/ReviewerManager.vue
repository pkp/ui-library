<template>
	<div>
		<div class="border border-light px-3 py-4">
			<h2 :id="headingId" class="text-lg-bold text-heading">
				{{ t('dashboard.summary.reviewers') }}
			</h2>
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
				<TableColumn>{{ 'action (t)' }}</TableColumn>
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
					<ReviewerCellActions
						:review-assignment="reviewAssignment"
						:submission="submission"
					></ReviewerCellActions>
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
import ReviewerCellActions from './ReviewerCellActions.vue';
import Icon from '@/components/Icon/Icon.vue';

import {useReviewerManagerStore} from './reviewerManagerStore.js';
import {useId} from '@/composables/useId.js';
import {useLocalize} from '@/composables/useLocalize.js';

const {generateId} = useId();
const {t} = useLocalize();
const headingId = generateId();

const props = defineProps({
	submission: {type: Object, required: true},
	redactedForAuthors: {type: Boolean, required: false, default: false},
});

const reviewerStore = useReviewerManagerStore(props);
</script>
