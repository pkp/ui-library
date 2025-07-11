<template>
	<div>
		<SideModalBody>
			<template #title>{{ t('manager.userComment.commentDetails') }}</template>
			<SideModalLayoutBasic>
				<div class="p-6 shadow">
					<div class="mb-4 flex items-center">
						<InitialsAvatar :initials="comment.userInitials" />
						<div class="ml-3">
							<p class="font-semibold">{{ comment.userName }}</p>
							<p class="text-sm">
								{{ formatShortDate(comment.createdAt) }}
							</p>
						</div>
					</div>
					<p v-strip-unsafe-html="comment.commentText" class="mb-6"></p>
				</div>

				<div class="mt-4">
					<FieldOptions
						:label="t('manager.userComment.approveThisComment')"
						:description="
							t('manager.userComment.approveThisComment.description')
						"
						type="checkbox"
						:options="userCommentStore.commentApprovalOptions"
						:value="comment.isApproved"
						@change="
							(fieldName, propName, newValue) =>
								userCommentStore.toggleCommentApproval(newValue)
						"
					/>
				</div>
				<div v-if="comment.isReported" class="mt-6 p-6 shadow">
					<div>
						<h3 class="mb-2 font-semibold">
							{{ t('manager.userComment.reports') }}
						</h3>
						<PkpTable>
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
							<TableBody>
								<TableRow
									v-for="(report, i) in userCommentStore.currentCommentReports"
									:key="i"
								>
									<TableCell>
										{{ report.note }}
									</TableCell>
									<TableCell>{{ report.userName }}</TableCell>
									<TableCell>{{ formatShortDate(report.createdAt) }}</TableCell>
									<TableCell>
										<PkpButton
											:is-link="true"
											@click="userCommentStore.openReport(report)"
										>
											{{ t('common.view') }}
										</PkpButton>
									</TableCell>
									<TableCell>
										<DropdownActions
											:label="t('common.moreActions')"
											button-variant="ellipsis"
											:actions="userCommentStore.getReportItemActions(report)"
											@action="
												(actionName) => userCommentStore[actionName](report)
											"
										/>
									</TableCell>
								</TableRow>
							</TableBody>
						</PkpTable>
					</div>
					<TablePagination
						:pagination="userCommentStore.currentCommentReportsPagination"
						@set-page="
							(...args) => userCommentStore.setCurrentReportsPage(...args)
						"
					></TablePagination>
				</div>
			</SideModalLayoutBasic>
		</SideModalBody>
	</div>
</template>

<script setup>
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import FieldOptions from '@/components/Form/fields/FieldOptions.vue';
import InitialsAvatar from '@/components/InitialsAvatar/InitialsAvatar.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import PkpButton from '@/components/Button/Button.vue';
import {useUserCommentStore} from '@/pages/userComments/userCommentStore';
import TablePagination from '@/components/Table/TablePagination.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useDate} from '@/composables/useDate';

const {formatShortDate} = useDate();
const {t} = useLocalize();

const props = defineProps({
	comment: {
		type: Object,
		required: true,
	},
});

const userCommentStore = useUserCommentStore(props);
</script>
