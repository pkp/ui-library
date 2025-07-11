<template>
	<div>
		<PkpTable>
			<template #label>
				<h1 class="text-3xl-bold">
					{{ t('manager.userComment.userComments') }}
				</h1>
			</template>
			<template #top-controls>
				<FieldSelect
					label="Status"
					:options="options"
					primary-locale="en"
					size="normal"
					:value="userCommentStore.selectedCommentStatus"
					@change="
						(fieldName, propName, newValue, localeKey) =>
							userCommentStore.onDropDownChanged(newValue)
					"
				/>
			</template>

			<TableHeader>
				<TableColumn
					v-for="(column, i) in userCommentStore.commentsPageColumns"
					:key="i"
				>
					<span :class="column.headerSrOnly ? 'sr-only' : ''">
						{{ column.header }}
					</span>
				</TableColumn>
			</TableHeader>

			<TableBody>
				<TableRow
					v-for="(comment, index) in userCommentStore.comments"
					:key="index"
				>
					<TableCell>
						<span
							v-strip-unsafe-html="comment.commentText.slice(0, 30) + '....'"
							class="text-lg-normal"
						></span>
					</TableCell>
					<TableCell>
						<span class="text-lg-normal">
							{{ comment.userName }}
						</span>
					</TableCell>
					<TableCell>{{ getStatusText(comment) }}</TableCell>
					<TableCell>
						<PkpButton
							:is-link="true"
							@click="userCommentStore.openCommentDetail(comment)"
						>
							{{ t('common.view') }}
						</PkpButton>
					</TableCell>
					<TableCell>
						<DropdownActions
							:label="t('common.moreActions')"
							button-variant="ellipsis"
							:actions="userCommentStore.getCommentItemActions(comment)"
							@action="(actionName) => userCommentStore[actionName](comment)"
						/>
					</TableCell>
				</TableRow>
			</TableBody>
		</PkpTable>
		<TablePagination
			:pagination="userCommentStore.commentsPagination"
			@set-page="(...args) => userCommentStore.setCurrentCommentsPage(...args)"
		></TablePagination>
	</div>
</template>
<script setup>
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import FieldSelect from '@/components/Form/fields/FieldSelect.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableCell from '@/components/Table/TableCell.vue';
import TableRow from '@/components/Table/TableRow.vue';
import PkpButton from '@/components/Button/Button.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useUserCommentStore} from '@/pages/userComments/userCommentStore';
import TablePagination from '@/components/Table/TablePagination.vue';

const props = defineProps({
	itemsPerPage: {
		type: Number,
		required: true,
	},
});

const userCommentStore = useUserCommentStore(props);
const {t} = useLocalize();

const options = [
	{
		label: t('manager.userComment.approved'),
		value: 'approved',
	},
	{
		label: t('manager.userComment.needsApproval'),
		value: 'needsApproval',
	},
	{
		label: t('manager.userComment.reported'),
		value: 'reported',
	},
];

function getStatusText(comment) {
	const status = [];
	if (comment.isApproved) {
		status.push('Approved');
	} else {
		status.push('Hidden/Needs Approval');
	}
	if (comment.isReported) {
		status.push('Reported');
	}
	return status.join(', ');
}
</script>
