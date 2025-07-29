<template>
	<div>
		<Tabs
			:track-history="true"
			:active-tab="userCommentStore.activeTab"
			:label="t('manager.userComment.userComments')"
			@update:active-tab="(tabId) => userCommentStore.onTabUpdate(tabId)"
		>
			<Tab
				v-for="(column, index) in userCommentStore.commentTabOptions"
				:id="column.id"
				:key="index"
				:label="column.label"
			>
				<Spinner v-if="userCommentStore.isCommentsLoading" size-variant="big" />
				<PkpTable>
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
									v-strip-unsafe-html="
										comment.commentText.slice(0, 30) + '....'
									"
									class="text-lg-normal"
								></span>
							</TableCell>
							<TableCell>
								<span class="text-lg-normal">
									{{ comment.userName }}
								</span>
							</TableCell>
							<TableCell>
								{{ userCommentStore.getCommentStatusText(comment) }}
							</TableCell>
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
									@action="
										(actionName) => userCommentStore[actionName](comment)
									"
								/>
							</TableCell>
						</TableRow>
					</TableBody>
				</PkpTable>
				<TablePagination
					:pagination="userCommentStore.commentsPagination"
					@set-page="
						(...args) => userCommentStore.setCurrentCommentsPage(...args)
					"
				></TablePagination>
			</Tab>
		</Tabs>
	</div>
</template>
<script setup>
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableCell from '@/components/Table/TableCell.vue';
import TableRow from '@/components/Table/TableRow.vue';
import PkpButton from '@/components/Button/Button.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useUserCommentStore} from '@/pages/userComments/userCommentStore';
import TablePagination from '@/components/Table/TablePagination.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import Tabs from '@/components/Tabs/Tabs.vue';
import Tab from '@/components/Tabs/Tab.vue';

const props = defineProps({
	itemsPerPage: {
		type: Number,
		required: true,
	},
});

const userCommentStore = useUserCommentStore(props);
const {t} = useLocalize();
</script>
