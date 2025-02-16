<template>
	<PkpTable>
		<template v-if="label" #label>
			<span v-strip-unsafe-html="label"></span>
		</template>
		<template v-if="description" #description>
			<span v-strip-unsafe-html="description"></span>
		</template>
		<template v-if="total > 0" #top-controls>
			<Spinner v-if="isLoadingItems"></Spinner>
			<PkpButton @click="requeueAll">
				{{ t('admin.jobs.failed.action.redispatch.all') }}
			</PkpButton>
		</template>
		<TableHeader>
			<TableColumn
				v-for="column in columns"
				:id="column.name"
				:key="column.name"
			>
				{{ column.label }}
			</TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow v-for="row in rows" :key="row.key">
				<TableCell>{{ row.id }}</TableCell>
				<TableCell>{{ row.displayName }}</TableCell>
				<TableCell>{{ row.queue }}</TableCell>
				<TableCell>{{ row.connection }}</TableCell>
				<TableCell>{{ row.failed_at }}</TableCell>
				<TableCell>
					<ButtonRow>
						<PkpButton @click="redispatch(row)">
							{{ t('admin.jobs.failed.action.redispatch') }}
						</PkpButton>
						<PkpButton is-warnable @click="remove(row)">
							{{ t('common.delete') }}
						</PkpButton>
						<PkpButton element="a" is-link :href="row._hrefs._details">
							{{ t('common.details') }}
						</PkpButton>
					</ButtonRow>
				</TableCell>
			</TableRow>
		</TableBody>
	</PkpTable>

	<Pagination
		v-if="lastPage > 1"
		:current-page="currentPage"
		:last-page="lastPage"
		:is-loading="isLoadingItems"
		@set-page="handlePagination"
	/>
</template>
<script>
import JobsPageBase from './JobsPageBase.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import PkpButton from '@/components/Button/Button.vue';

export default {
	name: 'FailedJobsPage',
	components: {
		PkpTable,
		TableHeader,
		TableColumn,
		TableBody,
		TableRow,
		TableCell,
		Pagination,
		ButtonRow,
		Spinner,
		PkpButton,
	},
	extends: JobsPageBase,
	methods: {
		removeJob(data) {
			this.rows = this.rows.filter((row) => row.id !== data.id);
			this.total = this.total - 1;
		},
		redispatch(data) {
			$.ajax({
				url: data._hrefs._redispatch,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
				},
				error: this.ajaxErrorCallback,
				success: (response) => {
					pkp.eventBus.$emit('notify', response.message, 'success');
					this.removeJob(data);
				},
			});
		},
		remove(data) {
			$.ajax({
				url: data._hrefs._delete,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
					'X-Http-Method-Override': 'DELETE',
				},
				error: this.ajaxErrorCallback,
				success: (response) => {
					pkp.eventBus.$emit('notify', response.message, 'success');
					this.removeJob(data);
				},
			});
		},
		requeueAll() {
			this.isLoadingItems = true;
			$.ajax({
				url: this.apiUrlRedispatchAll,
				type: 'POST',
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
				},
				error: this.ajaxErrorCallback,
				success: (response) => {
					pkp.eventBus.$emit('notify', response.message, 'success');
					this.loadList(1);
				},
			});
		},
	},
};
</script>
