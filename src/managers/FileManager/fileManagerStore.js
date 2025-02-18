import {defineComponentStore} from '@/utils/defineComponentStore';

import {computed, watch, toRefs} from 'vue';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useFileManagerActions} from './useFileManagerActions';
import {useFileManagerConfig} from './useFileManagerConfig';
import {useDataChanged} from '@/composables/useDataChanged';
import {useExtender} from '@/composables/useExtender';
export const useFileManagerStore = defineComponentStore(
	'fileManager',
	(props) => {
		const extender = useExtender();

		const {namespace, submissionStageId, submission} = toRefs(props);
		/**
		 * Manager configuration
		 */
		const fileManagerConfig = extender.addFns(useFileManagerConfig());

		const managerConfig = computed(() =>
			fileManagerConfig.getManagerConfig({
				namespace: namespace,
				submissionStageId: submissionStageId,
				submission,
			}),
		);

		/**
		 * Columns
		 */

		const columns = computed(() => fileManagerConfig.getColumns());

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

		const topItems = computed(() =>
			fileManagerConfig.getTopItems({
				managerConfig: managerConfig.value,
			}),
		);

		const bottomItems = computed(() =>
			fileManagerConfig.getBottomItems({
				managerConfig: managerConfig.value,
				filesCount: files.value?.length,
			}),
		);

		const itemActions = computed(() =>
			fileManagerConfig.getItemActions({
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
			columns,
			topItems,
			bottomItems,
			itemActions,
			fileUpload,
			fileSelectUpload,
			fileDownloadAll,
			fileEdit,
			fileDelete,
			fileSeeNotes,

			/** exposed for extensibility purposes */
			extender,
		};
	},
	{requireNamespace: true},
);
