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
			<TableRow v-for="(report, i) in items" :key="i">
				<TableCell>{{ report.userName }}</TableCell>
				<TableCell class="max-w-[25em] truncate">
					{{ report.note }}
				</TableCell>
				<TableCell>
					{{ formatShortDate(report.createdAt) }}
				</TableCell>
				<TableCell>
					<DropdownActions
						:label="t('common.moreActions')"
						button-variant="ellipsis"
						:actions="userCommentStore.getReportItemActions()"
						@action="(actionName) => userCommentStore[actionName](report)"
					/>
				</TableCell>
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
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import TablePagination from '@/components/Table/TablePagination.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableCell from '@/components/Table/TableCell.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import {useUserCommentStore} from '@/pages/userComments/userCommentStore';

import {useLocalize} from '@/composables/useLocalize';
import {useDate} from '@/composables/useDate';

const {t} = useLocalize();
const {formatShortDate} = useDate();

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
</script>
