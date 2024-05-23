<template>
	<div>
		<div class="border border-light px-3 py-4">
			<h2 :id="headingId" class="text-lg-bold text-heading">Reviewers (t)</h2>
		</div>
		<PkpTable
			aria-label="Example for basic table"
			:aria-describedby="headingId"
		>
			<TableHeader>
				<TableColumn>Reviewer (t)</TableColumn>
				<TableColumn v-if="!redactedForAuthors">
					Reviewer status (t)
				</TableColumn>
				<TableColumn>Type (t)</TableColumn>
			</TableHeader>
			<TableBody>
				<TableRow
					v-for="reviewAssignment in reviewerStore.reviewAssignments"
					:key="reviewAssignment.id"
				>
					<TableCell :is-row-header="true">
						<span class="text-base-normal">
							{{ reviewAssignment.id }} (will be name)
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
import Icon from '@/components/Icon/Icon.vue';

import {useReviewerManagerStore} from './reviewerManagerStore.js';
import {useId} from '@/composables/useId.js';

const {generateId} = useId();

const headingId = generateId();

const props = defineProps({
	redactedForAuthors: {type: Boolean, required: false, default: false},
	reviewAssignments: {type: Array, required: true},
});

const reviewerStore = useReviewerManagerStore(props);
</script>
