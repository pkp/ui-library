import {defineComponentStore} from '@/utils/defineComponentStore';

import {computed, watch, toRefs} from 'vue';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useFileManagerActions} from './useFileManagerActions';
import {useFileManagerConfig} from './useFileManagerConfig';
import {useDataChanged} from '@/composables/useDataChanged';
export const useFileManagerStore = defineComponentStore(
	'fileManager',
	(props) => {
		const {namespace, submissionStageId, submission} = toRefs(props);
		/**
		 * Manager configuration
		 */
		const {managerConfig} = useFileManagerConfig({
			namespace: namespace,
			submissionStageId: submissionStageId,
			submission,
		});

		/**
		 *  Files fetching
		 */
		const {apiUrl: filesApiUrl} = useUrl(
			`submissions/${submission.value.id}/files`,
		);

		const queryParams = computed(() => ({
			fileStages: managerConfig.value.fileStage,
			reviewRoundIds: props.reviewRoundId ? props.reviewRoundId : undefined,
		}));

		const {data, fetch: fetchFiles} = useFetch(filesApiUrl, {
			query: queryParams,
		});

		const files = computed(() => data.value?.items || []);

		watch(
			[filesApiUrl, queryParams],
			([newFilesApiUrl, newQueryParams], [oldFilesApiUrl, oldQueryParams]) => {
				if (
					newFilesApiUrl !== oldFilesApiUrl ||
					JSON.stringify(newQueryParams) !== JSON.stringify(oldQueryParams)
				) {
					data.value = null;
					fetchFiles();
				}
			},
			{immediate: true},
		);

		/** Reload files when data on screen changes */
		const {triggerDataChange} = useDataChanged(() => fetchFiles());

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

		function actionFinishCallback() {
			triggerDataChange();
		}
		function enrichActionArgs(_args = {}) {
			return {
				..._args,
				submissionStageId: props.submissionStageId,
				reviewRoundId: props.reviewRoundId,
				submission: props.submission,
				fileStage: managerConfig.value.fileStage,
				wizardTitleKey: managerConfig.value.wizardTitleKey,
				uploadSelectTitleKey: managerConfig.value.uploadSelectTitleKey,
				gridComponent: managerConfig.value.gridComponent,
				titleKey: managerConfig.value.titleKey,
			};
		}

		function fileUpload() {
			_actionFns.fileUpload(enrichActionArgs(), actionFinishCallback);
		}

		function fileSelectUpload() {
			_actionFns.fileSelectUpload(enrichActionArgs(), actionFinishCallback);
		}

		function fileDownloadAll() {
			_actionFns.fileDownloadAll(enrichActionArgs(), actionFinishCallback);
		}

		function fileEdit({file}) {
			_actionFns.fileEdit(enrichActionArgs({file}), actionFinishCallback);
		}

		function fileDelete({file}) {
			_actionFns.fileDelete(enrichActionArgs({file}), () => {
				actionFinishCallback();
				$('body').trigger('notifyUser');
			});
		}

		function fileSeeNotes({file}) {
			_actionFns.fileSeeNotes(enrichActionArgs({file}), actionFinishCallback);
		}

		return {
			title: props.title,
			files,
			fetchFiles,
			managerConfig,
			topActions,
			bottomActions,
			itemActions,
			fileUpload,
			fileSelectUpload,
			fileDownloadAll,
			fileEdit,
			fileDelete,
			fileSeeNotes,

			/** exposed for extensibility purposes */
			_actionFns,
		};
	},
	{requireNamespace: true},
);
