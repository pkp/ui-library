<template>
	<PkpTable>
		<template #label>
			{{ t('manager.userComment.reports') }}
		</template>
		<template #description>
			<span>
				{{ t('manager.userComment.report.description') }}
			</span>
		</template>
		<TableHeader>
			<TableColumn
				v-for="(column, i) in userCommentStore.reportsTableColumns"
				:key="i"
			>
				<span :class="column.headerSrOnly ? 'sr-only' : ''">
					{{ column.header }}
				</span>
			</TableColumn>
		</TableHeader>
		<TableBody :empty-text="t('manager.userComment.report.noReports')">
			<TableRow v-for="report in items" :key="report.id">
				<component
					:is="Components[column.component] || column.component"
					v-for="(column, i) in userCommentStore.reportsTableColumns"
					:key="i"
					:item="report"
					v-bind="column.props"
				></component>
			</TableRow>
		</TableBody>
	</PkpTable>
	<TablePagination
		v-if="userCommentStore.currentCommentReportsPagination.pageCount > 1"
		:pagination="userCommentStore.currentCommentReportsPagination"
		@set-page="(...args) => userCommentStore.setCurrentReportsPage(...args)"
	></TablePagination>
</template>

<script setup>
import TableColumn from '@/components/Table/TableColumn.vue';
import PkpTable from '@/components/Table/Table.vue';
import TablePagination from '@/components/Table/TablePagination.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import {useUserCommentStore} from '@/pages/userComments/userCommentStore';
import {useLocalize} from '@/composables/useLocalize';
import UserCommentCellUserName from '@/pages/userComments/UserCommentCellUserName.vue';
import UserCommentReportCellReason from '@/pages/userComments/UserCommentReportCellReason.vue';
import UserCommentReportCellDateReported from '@/pages/userComments/UserCommentReportCellDateReported.vue';
import UserCommentReportCellMoreActions from '@/pages/userComments/UserCommentReportCellMoreActions.vue';

const {t} = useLocalize();

defineProps({
	/**
	 * Array of user comment reports to display.
	 */
	items: {
		type: Array,
		required: true,
	},
});

const userCommentStore = useUserCommentStore();

const Components = {
	UserCommentCellUserName,
	UserCommentReportCellReason,
	UserCommentReportCellDateReported,
	UserCommentReportCellMoreActions,
};
</script>
