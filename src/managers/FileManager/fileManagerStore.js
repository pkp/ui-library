import {defineComponentStore} from '@/utils/defineComponentStore';

import {ref, toRefs, computed} from 'vue';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {useLocalize} from '@/composables/useLocalize';
import {Actions, useFileManagerActions} from './useFileManagerActions';

const {tk} = useLocalize();

export const FileManagerConfigurations = {
	EDITOR_SUBMISSION_FILES: ({stageId}) => ({
		actions: [
			Actions.UPLOAD,
			Actions.DOWNLOAD_ALL,
			Actions.EDIT,
			Actions.DELETE,
			Actions.SEE_NOTES,
		],
		fileStage: pkp.const.SUBMISSION_FILE_SUBMISSION,
		title: tk('dashboard.summary.deskReviewFiles'),
		description: tk('dashboard.summary.deskReviewFilesDescription'),
		wizardTitleKey: tk('submission.submit.uploadSubmissionFile'),
	}),
};

export const useFileManagerStore = defineComponentStore(
	'fileManager',
	(props) => {
		const {t} = useLocalize();

		const submissionId = ref(props.submissionId);

		const {apiUrl: filesApiUrl} = useUrl(
			`submissions/${submissionId.value}/files`,
		);

		/** Expose file manager configuration */
		const managerConfiguration = computed(() => {
			const config = FileManagerConfigurations[props.configName]({
				stageId: props.submissionStageId,
			});

			return {
				...config,
				title: t(config.title),
				description: t(config.description),
			};
		});

		const {data, fetch: fetchFiles} = useFetch(filesApiUrl, {
			query: {
				fileStages: managerConfiguration.value.fileStage,
				reviewRoundId: props.reviewRoundId ? props.reviewRoundId : undefined,
			},
		});

		const files = computed(() => data.value?.items || []);

		fetchFiles();

		/** Handling Actions */

		const {
			getItemActions: _getItemActions,
			getBottomActions: _getBottomActions,
			getTopActions: _getTopActions,
			handleAction: _handleAction,
			handleItemAction: _handleItemAction,
		} = toRefs(useFileManagerActions());

		const topActions = computed(() =>
			_getTopActions.value({
				managerConfiguration: managerConfiguration.value,
			}),
		);

		const bottomActions = computed(() =>
			_getBottomActions.value({
				managerConfiguration: managerConfiguration.value,
				filesCount: files.value.length,
			}),
		);

		const itemActions = computed(() =>
			_getItemActions.value({
				managerConfiguration: managerConfiguration.value,
			}),
		);

		function handleItemAction(actionName, {file}) {
			_handleItemAction.value(
				actionName,
				{
					file,
					submissionStageId: props.submissionStageId,
					reviewRoundId: props.reviewRoundId,
					submissionId: props.submissionId,
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
			_handleAction.value(
				actionName,
				{
					submissionStageId: props.submissionStageId,
					reviewRoundId: props.reviewRoundId,
					submissionId: props.submissionId,
					fileStage: managerConfiguration.value.fileStage,
					wizardTitleKey: managerConfiguration.value.wizardTitleKey,
				},
				() => fetchFiles(),
			);
		}

		return {
			title: props.title,
			files,
			fetchFiles,
			managerConfiguration,
			_handleAction,
			_handleItemAction,
			_getItemActions,
			_getBottomActions,
			_getTopActions,
			topActions,
			bottomActions,
			itemActions,
			handleItemAction,
			handleAction,
		};
	},
);
