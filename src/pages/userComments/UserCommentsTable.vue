<template>
	<div>
		<Spinner v-if="userCommentStore.isCommentsLoading" size-variant="big" />
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

			<TableBody>
				<TableRow v-for="(comment, index) in items" :key="index">
					<TableCell class="max-w-[25em]">
						<div class="truncate">
							<span class="mr-1">{{ comment.id }}.</span>
							<span class="font-bold">
								{{ comment.publication.authorsStringShort }}
							</span>
							<span>;</span>
							<span>{{ comment.publication.fullTitle }}</span>
						</div>
					</TableCell>
					<TableCell class="max-w-[25em]">
						<div
							v-strip-unsafe-html="comment.commentText"
							class="truncate"
						></div>
					</TableCell>
					<TableCell>
						{{ comment.userName }}
					</TableCell>
					<TableCell>
						{{ userCommentStore.getCommentStatusText(comment) }}
					</TableCell>
					<TableCell>
						<DropdownActions
							:label="t('common.moreActions')"
							button-variant="ellipsis"
							:actions="userCommentStore.getCommentItemActions()"
							@action="(actionName) => userCommentStore[actionName](comment)"
						/>
					</TableCell>
				</TableRow>
			</TableBody>
		</PkpTable>
		<TablePagination
			v-if="userCommentStore.commentsPagination.pageCount > 1"
			:pagination="userCommentStore.commentsPagination"
			@set-page="(...args) => userCommentStore.setCurrentCommentsPage(...args)"
		></TablePagination>
	</div>
</template>

<script setup>
import TableColumn from '@/components/Table/TableColumn.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import PkpTable from '@/components/Table/Table.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import TablePagination from '@/components/Table/TablePagination.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableCell from '@/components/Table/TableCell.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import {useUserCommentStore} from '@/pages/userComments/userCommentStore';

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
</script>
