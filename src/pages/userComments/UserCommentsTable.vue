<template>
	<PkpTable>
		<TableHeader>
			<TableColumn
				v-for="(column, i) in userCommentStore.commentsTableColumns"
				:key="i"
			>
				<span :class="column.headerSrOnly ? 'sr-only' : ''">
					{{ column.header }}
				</span>
			</TableColumn>
		</TableHeader>
		<TableBody
			:empty-text="
				userCommentStore.isCommentsLoading
					? t('common.loading')
					: t('grid.noItems')
			"
		>
			<TableRow v-for="comment in items" :key="comment.id">
				<component
					:is="Components[column.component] || column.component"
					v-for="(column, i) in userCommentStore.commentsTableColumns"
					:key="i"
					:item="comment"
					v-bind="column.props"
				></component>
			</TableRow>
		</TableBody>
	</PkpTable>
	<TablePagination
		v-if="userCommentStore.commentsPagination.pageCount > 1"
		:pagination="userCommentStore.commentsPagination"
		@set-page="(...args) => userCommentStore.setCurrentCommentsPage(...args)"
	></TablePagination>
</template>

<script setup>
import TableColumn from '@/components/Table/TableColumn.vue';
import PkpTable from '@/components/Table/Table.vue';
import TablePagination from '@/components/Table/TablePagination.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useUserCommentStore} from '@/pages/userComments/userCommentStore';
import UserCommentCellSubmission from '@/pages/userComments/UserCommentCellSubmission.vue';
import UserCommentCellComment from '@/pages/userComments/UserCommentCellComment.vue';
import UserCommentCellUserName from '@/pages/userComments/UserCommentCellUserName.vue';
import UserCommentCellMoreActions from '@/pages/userComments/UserCommentCellMoreActions.vue';
import UserCommentCellStatus from '@/pages/userComments/UserCommentCellStatus.vue';

const {t} = useLocalize();
const userCommentStore = useUserCommentStore();

defineProps({
	/**
	 * Array of comments to display in the table.
	 */
	items: {
		type: Array,
		required: true,
	},
});

const Components = {
	UserCommentCellSubmission,
	UserCommentCellComment,
	UserCommentCellUserName,
	UserCommentCellStatus,
	UserCommentCellMoreActions,
};
</script>
