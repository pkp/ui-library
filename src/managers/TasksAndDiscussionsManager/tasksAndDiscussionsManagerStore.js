import {defineComponentStore} from '@/utils/defineComponentStore';

import {computed, toRefs} from 'vue';
import {useExtender} from '@/composables/useExtender';
import {useTasksAndDiscussionsConfig} from './useTasksAndDiscussionsConfig';

export const useTasksAndDiscussionsManagerStore = defineComponentStore(
	'tasksAndDiscussionsManager',
	(props) => {
		const extender = useExtender();

		const {submission} = toRefs(props);

		function getTasksAndDiscussionsByStatus(status) {
			return props.tasksAndDiscussions.filter((data) => data.status === status);
		}

		const tasksAndDiscussions = [
			{
				name: 'Yet To Begin',
				icon: 'New',
				rowId: 'td_pending',
				items: getTasksAndDiscussionsByStatus('Pending'),
			},
			{
				name: 'In Progress',
				icon: 'InProgress',
				rowId: 'td_inProgress',
				items: getTasksAndDiscussionsByStatus('In Progress'),
			},
			{
				name: 'Closed',
				icon: 'Complete',
				rowId: 'td_complete',
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

		function getActionArgs() {
			return {
				config: tasksAndDiscussionsConfig.value,
				tasksAndDiscussions,
			};
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

			/** Extender */
			extender,
			props,
		};
	},
);
