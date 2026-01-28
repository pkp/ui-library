import {defineComponentStore} from '@/utils/defineComponentStore';

import {computed, toRefs, watch} from 'vue';
import {t} from '@/utils/i18n';
import {useExtender} from '@/composables/useExtender';
import {useDataChanged} from '@/composables/useDataChanged';
import {useUrl} from '@/composables/useUrl';
import {useFetchPaginated} from '@/composables/useFetchPaginated';
import {useDiscussionManagerConfig} from './useDiscussionManagerConfig';
import {useDiscussionManagerActions} from './useDiscussionManagerActions';

export const useDiscussionManagerStore = defineComponentStore(
	'discussionManager',
	(props) => {
		const extender = useExtender();

		const {submission} = toRefs(props);

		const relativeUrl = computed(() => {
			return `submissions/${encodeURIComponent(submission.value.id)}/stages/${props.submissionStageId}/tasks?orderBy=dateCreated`;
		});

		const {apiUrl: submissionTasksApiUrl} = useUrl(relativeUrl);

		const {
			items: discussionsData,
			fetch: fetchDiscussions,
			isLoading: isLoadingDiscussions,
		} = useFetchPaginated(submissionTasksApiUrl, {
			page: 1,
			pageSize: 999, // set to a high number to fetch all items, until we implement pagination
		});

		watch(relativeUrl, () => {
			fetchDiscussions({clearData: true});
		});

		fetchDiscussions();

		const {triggerDataChange} = useDataChanged(() => fetchDiscussions());

		function triggerDataChangeCallback() {
			triggerDataChange();
		}

		function getDiscussionByStatus(status) {
			return computed(
				() =>
					discussionsData.value?.filter((data) => data.status === status) || [],
			);
		}

		const discussions = [
			{
				name: t('common.yetToBegin'),
				key: 'pending',
				icon: 'New',
				items: getDiscussionByStatus(pkp.const.EDITORIAL_TASK_STATUS_PENDING),
			},
			{
				name: t('common.inProgress'),
				key: 'inProgress',
				icon: 'InProgress',
				items: getDiscussionByStatus(
					pkp.const.EDITORIAL_TASK_STATUS_IN_PROGRESS,
				),
			},
			{
				name: t('common.closed'),
				key: 'closed',
				icon: 'Complete',
				items: getDiscussionByStatus(pkp.const.EDITORIAL_TASK_STATUS_CLOSED),
			},
		];

		/** Columns */
		const discussionManagerConfig = extender.addFns(
			useDiscussionManagerConfig(),
		);
		const columns = computed(() => discussionManagerConfig.getColumns());

		/**
		 * Configs
		 */
		const discussionConfig = computed(() =>
			discussionManagerConfig.getManagerConfig({
				submission,
				submissionStageId: props.submissionStageId,
			}),
		);

		function getItemActions({workItem}) {
			return discussionManagerConfig.getItemActions({
				workItem,
				...getActionArgs(),
			});
		}

		const bottomItems = computed(() =>
			discussionManagerConfig.getBottomItems(getActionArgs()),
		);

		const topItems = computed(() =>
			discussionManagerConfig.getTopItems(getActionArgs()),
		);

		/**
		 * Actions
		 */
		const discussionActions = useDiscussionManagerActions();

		function getActionArgs() {
			return {
				config: discussionConfig.value,
				discussions,
			};
		}

		function discussionView({workItem}) {
			discussionActions.discussionView(
				{
					workItem,
					submission: props.submission,
					submissionStageId: props.submissionStageId,
				},
				triggerDataChangeCallback,
			);
		}

		function discussionAdd() {
			discussionActions.discussionAdd(
				{
					submission: props.submission,
					submissionStageId: props.submissionStageId,
				},
				triggerDataChangeCallback,
			);
		}

		function discussionSearch() {
			discussionActions.discussionSearch(
				{
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		function discussionEdit({workItem}) {
			discussionActions.discussionEdit(
				{
					submission: props.submission,
					submissionStageId: props.submissionStageId,
					workItem,
				},
				triggerDataChangeCallback,
			);
		}

		function discussionHistory({workItem}) {
			discussionActions.discussionHistory(
				{
					submission: props.submission,
					workItem,
				},
				triggerDataChangeCallback,
			);
		}

		function discussionAddTaskDetails({workItem}) {
			discussionActions.discussionAddTaskDetails(
				{
					submission: props.submission,
					submissionStageId: props.submissionStageId,
					workItem,
				},
				triggerDataChangeCallback,
			);
		}

		function discussionDelete({workItem}) {
			discussionActions.discussionDelete(
				{
					submission: props.submission,
					workItem,
				},
				triggerDataChangeCallback,
			);
		}

		function discussionStartTask({workItem}) {
			discussionActions.discussionStartTask(
				{
					submission: props.submission,
					submissionStageId: props.submissionStageId,
					workItem,
				},
				triggerDataChangeCallback,
			);
		}

		function discussionSetClosed({workItem, status}) {
			discussionActions.discussionSetClosed(
				{
					submission: props.submission,
					submissionStageId: props.submissionStageId,
					workItem,
					status,
				},
				triggerDataChangeCallback,
			);
		}

		function userHasWriteAccess({workItem} = {}) {
			return discussionManagerConfig.userHasWriteAccess({workItem});
		}

		return {
			discussions,
			isLoadingDiscussions,

			/**
			 * Config
			 * */
			discussionConfig,
			columns,
			getItemActions,
			topItems,
			bottomItems,
			userHasWriteAccess,

			/** Actions */
			discussionView,
			discussionAdd,
			discussionSearch,
			discussionEdit,
			discussionHistory,
			discussionAddTaskDetails,
			discussionDelete,
			discussionStartTask,
			discussionSetClosed,

			/** Extender */
			extender,
			props,
		};
	},
);
