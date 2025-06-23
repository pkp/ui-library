import {defineComponentStore} from '@/utils/defineComponentStore';

import {computed, toRefs} from 'vue';
import {useExtender} from '@/composables/useExtender';
import {useDataChanged} from '@/composables/useDataChanged';
import {useTasksAndDiscussionsConfig} from './useTasksAndDiscussionsManagerConfig';
import {useTasksAndDiscussionsManagerActions} from './useTasksAndDiscussionsManagerActions';

export const useTasksAndDiscussionsManagerStore = defineComponentStore(
	'tasksAndDiscussionsManager',
	(props) => {
		const extender = useExtender();

		const {submission} = toRefs(props);

		function getTasksAndDiscussionsByStatus(status) {
			return (
				props.tasksAndDiscussions?.filter((data) => data.status === status) ||
				[]
			);
		}

		const tasksAndDiscussions = [
			{
				name: 'Yet To Begin',
				icon: 'New',
				items: getTasksAndDiscussionsByStatus('Pending'),
			},
			{
				name: 'In Progress',
				icon: 'InProgress',
				items: getTasksAndDiscussionsByStatus('In Progress'),
			},
			{
				name: 'Closed',
				icon: 'Complete',
				items: getTasksAndDiscussionsByStatus('Closed'),
			},
		];

		/** Columns */
		const tasksAndDiscussionsManagerConfig = extender.addFns(
			useTasksAndDiscussionsConfig(),
		);
		const columns = computed(() =>
			tasksAndDiscussionsManagerConfig.getColumns(),
		);

		/**
		 * Configs
		 */
		const tasksAndDiscussionsConfig = computed(() =>
			tasksAndDiscussionsManagerConfig.getManagerConfig({
				submission,
			}),
		);

		function getItemActions({workItem}) {
			return tasksAndDiscussionsManagerConfig.getItemActions({
				workItem,
				...getActionArgs(),
			});
		}

		const bottomItems = computed(() =>
			tasksAndDiscussionsManagerConfig.getBottomItems(getActionArgs()),
		);

		const topItems = computed(() =>
			tasksAndDiscussionsManagerConfig.getTopItems(getActionArgs()),
		);

		/**
		 * Actions
		 */
		const tasksAndDiscussionsActions = useTasksAndDiscussionsManagerActions();

		function getActionArgs() {
			return {
				config: tasksAndDiscussionsConfig.value,
				tasksAndDiscussions,
			};
		}

		const {triggerDataChange} = useDataChanged();

		function triggerDataChangeCallback() {
			triggerDataChange();
		}

		function tasksAndDiscussionsAdd() {
			tasksAndDiscussionsActions.tasksAndDiscussionsAdd(
				{
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		function tasksAndDiscussionsSearch() {
			tasksAndDiscussionsActions.tasksAndDiscussionsSearch(
				{
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		function tasksAndDiscussionsEdit() {
			tasksAndDiscussionsActions.tasksAndDiscussionsEdit(
				{
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		function tasksAndDiscussionsHistory() {
			tasksAndDiscussionsActions.tasksAndDiscussionsHistory(
				{
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		function tasksAndDiscussionsAddTaskDetails() {
			tasksAndDiscussionsActions.tasksAndDiscussionsAddTaskDetails(
				{
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		function tasksAndDiscussionsDelete() {
			tasksAndDiscussionsActions.tasksAndDiscussionsDelete(
				{
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		return {
			tasksAndDiscussions,

			/**
			 * Config
			 * */
			columns,
			getItemActions,
			topItems,
			bottomItems,

			/** Actions */
			tasksAndDiscussionsAdd,
			tasksAndDiscussionsSearch,
			tasksAndDiscussionsEdit,
			tasksAndDiscussionsHistory,
			tasksAndDiscussionsAddTaskDetails,
			tasksAndDiscussionsDelete,

			/** Extender */
			extender,
			props,
		};
	},
);
