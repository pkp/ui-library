<template>
	<div data-cy="reviewer-manager">
		<PkpTable
			aria-label="Example for basic table"
			:aria-describedby="headingId"
		>
			<template #label>
				<h3 class="">
					{{ t('user.role.reviewers') }}
				</h3>
			</template>
			<template #top-controls>
				<div class="flex gap-x-2">
					<component
						:is="Components[action.component] || action.component"
						v-bind="action.props || {}"
						v-for="(action, i) in reviewerStore.topItems"
						:key="i"
					></component>
				</div>
			</template>
			<TableHeader>
				<TableColumn v-for="(column, i) in reviewerStore.columns" :key="i">
					<span :class="column.headerSrOnly ? 'sr-only' : ''">
						{{ column.header }}
					</span>
				</TableColumn>
			</TableHeader>
			<TableBody>
				<TableRow
					v-for="reviewAssignment in reviewerStore.reviewAssignments"
					:key="reviewAssignment.id"
				>
					<component
						:is="Components[column.component] || column.component"
						v-for="(column, i) in reviewerStore.columns"
						:key="i"
						v-bind="column.props"
						:review-assignment="reviewAssignment"
					></component>
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

import ReviewerManagerCellReviewer from './ReviewerManagerCellReviewer.vue';
import ReviewerManagerCellPrimaryActions from './ReviewerManagerCellPrimaryActions.vue';
import ReviewerManagerCellActions from './ReviewerManagerCellActions.vue';
import ReviewerManagerCellStatus from './ReviewerManagerCellStatus.vue';
import ReviewerManagerCellReviewType from './ReviewerManagerCellReviewType.vue';

import ReviewerManagerActionButton from './ReviewerManagerActionButton.vue';

import {useReviewerManagerStore} from './reviewerManagerStore.js';
import {useId} from '@/composables/useId.js';
import {useLocalize} from '@/composables/useLocalize.js';

const {generateId} = useId();
const {t} = useLocalize();
const headingId = generateId();

const Components = {
	ReviewerManagerCellReviewer,
	ReviewerManagerCellStatus,
	ReviewerManagerCellReviewType,
	ReviewerManagerCellPrimaryActions,
	ReviewerManagerCellActions,
	ReviewerManagerActionButton,
};

const props = defineProps({
	submission: {type: Object, required: true},
	reviewRoundId: {type: Number, required: true},
	redactedForAuthors: {type: Boolean, required: false, default: false},
	componentForms: {type: Object, required: true},
});

const reviewerStore = useReviewerManagerStore(props);
</script>
