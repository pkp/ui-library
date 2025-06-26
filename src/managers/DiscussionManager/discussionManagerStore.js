import {defineComponentStore} from '@/utils/defineComponentStore';

import {computed, toRefs} from 'vue';
import {useExtender} from '@/composables/useExtender';
import {useDataChanged} from '@/composables/useDataChanged';
import {useDiscussionManagerConfig} from './useDiscussionManagerConfig';
import {useDiscussionManagerActions} from './useDiscussionManagerActions';

export const useDiscussionManagerStore = defineComponentStore(
	'discussionManager',
	(props) => {
		const extender = useExtender();

		const {submission} = toRefs(props);

		function getDiscussionByStatus(status) {
			return props.discussions?.filter((data) => data.status === status) || [];
		}

		const discussions = [
			{
				name: 'Yet To Begin',
				icon: 'New',
				items: getDiscussionByStatus('Pending'),
			},
			{
				name: 'In Progress',
				icon: 'InProgress',
				items: getDiscussionByStatus('In Progress'),
			},
			{
				name: 'Closed',
				icon: 'Complete',
				items: getDiscussionByStatus('Closed'),
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

		const {triggerDataChange} = useDataChanged();

		function triggerDataChangeCallback() {
			triggerDataChange();
		}

		function discussionAdd() {
			discussionActions.discussionAdd(
				{
					submission: props.submission,
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

		function discussionEdit() {
			discussionActions.discussionEdit(
				{
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		function discussionHistory() {
			discussionActions.discussionHistory(
				{
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		function discussionAddTaskDetails() {
			discussionActions.discussionAddTaskDetails(
				{
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		function discussionDelete() {
			discussionActions.discussionDelete(
				{
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		return {
			discussions,

			/**
			 * Config
			 * */
			columns,
			getItemActions,
			topItems,
			bottomItems,

			/** Actions */
			discussionAdd,
			discussionSearch,
			discussionEdit,
			discussionHistory,
			discussionAddTaskDetails,
			discussionDelete,

			/** Extender */
			extender,
			props,
		};
	},
);
