import {defineComponentStore} from '@/utils/defineComponentStore';

import {ref, computed} from 'vue';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {Actions, useFileManagerActions} from './useFileManagerActions';
import {useFileManagerConfig} from './useFileManagerConfig';
export const useFileManagerStore = defineComponentStore(
	'fileManager',
	(props) => {
		const submissionId = ref(props.submission.id);

		/**
		 * Manager configuration
		 */
		const {managerConfig} = useFileManagerConfig({
			configName: props.configName,
			submissionStageId: props.submissionStageId,
		});

		/**
		 *  Files fetching
		 */
		const {apiUrl: filesApiUrl} = useUrl(
			`submissions/${submissionId.value}/files`,
		);

		const {data, fetch: fetchFiles} = useFetch(filesApiUrl, {
			query: {
				fileStages: managerConfig.value.fileStage,
				reviewRoundId: props.reviewRoundId ? props.reviewRoundId : undefined,
			},
		});

		const files = computed(() => data.value?.items || []);

		fetchFiles();

		/**
		 * Handling Actions
		 */

		const _actionFns = useFileManagerActions();

		const topActions = computed(() =>
			_actionFns.getTopActions({
				managerConfig: managerConfig.value,
			}),
		);

		const bottomActions = computed(() =>
			_actionFns.getBottomActions({
				managerConfig: managerConfig.value,
				filesCount: files.value.length,
			}),
		);

		const itemActions = computed(() =>
			_actionFns.getItemActions({
				managerConfig: managerConfig.value,
			}),
		);

		function handleItemAction(actionName, {file}) {
			_actionFns.handleItemAction(
				actionName,
				{
					file,
					submissionStageId: props.submissionStageId,
					reviewRoundId: props.reviewRoundId,
					submission: props.submission,
				},
				() => {
					fetchFiles();

					// delete actions creates legacy notifications
					// calling explicitely to check for it
					if (actionName === Actions.DELETE) {
						$('body').trigger('notifyUser');
					}
				},
			);
		}

		function handleAction(actionName) {
			_actionFns.handleAction(
				actionName,
				{
					submissionStageId: props.submissionStageId,
					reviewRoundId: props.reviewRoundId,
					submission: props.submission,
					fileStage: managerConfig.value.fileStage,
					wizardTitleKey: managerConfig.value.wizardTitleKey,
					uploadSelectTitleKey: managerConfig.value.uploadSelectTitleKey,
					gridComponent: managerConfig.value.gridComponent,
				},
				() => fetchFiles(),
			);
		}

		return {
			title: props.title,
			files,
			fetchFiles,
			managerConfig,
			topActions,
			bottomActions,
			itemActions,
			handleItemAction,
			handleAction,
			/** exposed for extensibility purposes */
			_actionFns,
		};
	},
);
