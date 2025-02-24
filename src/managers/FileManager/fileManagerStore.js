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
		 * Config
		 */
		const fileManagerConfig = extender.addFns(useFileManagerConfig());

		const managerConfig = computed(() =>
			fileManagerConfig.getManagerConfig({
				namespace: namespace,
				submissionStageId: submissionStageId,
				submission,
			}),
		);

		const columns = computed(() => fileManagerConfig.getColumns());
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
		const fileManagerActions = useFileManagerActions();

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
			fileManagerActions.fileUpload(enrichActionArgs(), actionFinishCallback);
		}

		function fileSelectUpload() {
			fileManagerActions.fileSelectUpload(
				enrichActionArgs(),
				actionFinishCallback,
			);
		}

		function fileDownloadAll() {
			fileManagerActions.fileDownloadAll(
				enrichActionArgs(),
				actionFinishCallback,
			);
		}

		function fileEdit({file}) {
			fileManagerActions.fileEdit(
				enrichActionArgs({file}),
				actionFinishCallback,
			);
		}

		function fileDelete({file}) {
			fileManagerActions.fileDelete(enrichActionArgs({file}), () => {
				actionFinishCallback();
				$('body').trigger('notifyUser');
			});
		}

		function fileSeeNotes({file}) {
			fileManagerActions.fileSeeNotes(
				enrichActionArgs({file}),
				actionFinishCallback,
			);
		}

		return {
			title: props.title,
			files,
			fetchFiles,

			/**
			 * Config
			 * */
			managerConfig,
			columns,
			topItems,
			bottomItems,
			itemActions,

			/**
			 * Actions
			 * */
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
