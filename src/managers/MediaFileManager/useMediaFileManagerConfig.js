import {useLocalize} from '@/composables/useLocalize';
import {Actions} from './useMediaFileManagerActions';

export const MediaFileManagerConfigurations = {
	permissions: [
		{
			roles: [pkp.const.ROLE_ID_MANAGER, pkp.const.ROLE_ID_SITE_ADMIN],
			actions: [
				Actions.MEDIA_FILE_LIST,
				Actions.MEDIA_FILE_ADD,
				Actions.MEDIA_FILE_BATCH_LINK_IMAGES,
				Actions.MEDIA_FILE_INFO,
				Actions.MEDIA_FILE_EDIT_METADATA,
				Actions.MEDIA_FILE_MANUALLY_LINK_IMAGE,
				Actions.MEDIA_FILE_DELETE,
			],
		},
	],
	actions: [
		Actions.MEDIA_FILE_LIST,
		Actions.MEDIA_FILE_ADD,
		Actions.MEDIA_FILE_BATCH_LINK_IMAGES,
		Actions.MEDIA_FILE_INFO,
		Actions.MEDIA_FILE_EDIT_METADATA,
		Actions.MEDIA_FILE_MANUALLY_LINK_IMAGE,
		Actions.MEDIA_FILE_DELETE,
	],
};

export function useMediaFileManagerConfig() {
	const {t} = useLocalize();

	const mediaTypeOptions = [
		{value: 'image', label: 'Image'},
		{value: 'audio', label: 'Audio'},
		{value: 'video', label: 'Video'},
		{value: 'document', label: 'Document'},
		{value: 'supplementary', label: 'Supplementary'},
	];

	const supportedFileTypesLabel =
		'PNG, JPG, JPEG, GIF, BMP, WEBP (web); TIFF, SVG, EPS, AI, PDF (hi-res); MP4, MOV, AVI, WMV, MPEG, WEBM (video)';

	function getColumns() {
		const columns = [];

		columns.push({
			header: t('common.id'),
			component: 'MediaFileManagerCellGroupId',
		});

		columns.push({
			header: t('common.fileName'),
			component: 'MediaFileManagerCellName',
		});

		columns.push({
			header: t('common.type'),
			component: 'MediaFileManagerCellType',
		});

		columns.push({
			header: t('common.size'),
			component: 'MediaFileManagerCellSize',
		});

		columns.push({
			header: t('common.dateUploaded'),
			component: 'MediaFileManagerCellDateUploaded',
		});

		columns.push({
			header: t('common.moreActions'),
			headerSrOnly: true,
			component: 'MediaFileManagerCellActions',
		});

		return columns;
	}

	function getManagerConfig() {
		const permittedActions = MediaFileManagerConfigurations.actions.filter(
			(action) => {
				return MediaFileManagerConfigurations.permissions.some((perm) => {
					return perm.actions.includes(action);
				});
			},
		);
		return {permittedActions};
	}

	function getTopItems({config}) {
		const actions = [];
		const enabledActions = config.permittedActions;

		if (enabledActions.includes(Actions.MEDIA_FILE_BATCH_LINK_IMAGES)) {
			actions.push({
				component: 'MediaFileManagerActionButton',
				props: {
					label: t('publication.mediaFiles.batchLinkImages'),
					action: Actions.MEDIA_FILE_BATCH_LINK_IMAGES,
				},
			});
		}

		if (enabledActions.includes(Actions.MEDIA_FILE_ADD)) {
			actions.push({
				component: 'MediaFileManagerActionButton',
				props: {
					label: t('publication.mediaFiles.add'),
					action: Actions.MEDIA_FILE_ADD,
				},
			});
		}

		return actions;
	}

	function getItemActions({config, mediaFile}) {
		const actions = [];

		if (config.permittedActions.includes(Actions.MEDIA_FILE_INFO)) {
			actions.push({
				label: t('grid.action.moreInformation'),
				name: Actions.MEDIA_FILE_INFO,
				icon: 'View',
			});
		}

		if (config.permittedActions.includes(Actions.MEDIA_FILE_EDIT_METADATA)) {
			actions.push({
				label: t('grid.action.editMetadata'),
				name: Actions.MEDIA_FILE_EDIT_METADATA,
				icon: 'Edit',
			});
		}

		if (
			config.permittedActions.includes(Actions.MEDIA_FILE_MANUALLY_LINK_IMAGE)
		) {
			actions.push({
				label: t('publication.mediaFiles.manuallyLinkImage'),
				name: Actions.MEDIA_FILE_MANUALLY_LINK_IMAGE,
				icon: 'Upload',
			});
		}

		if (config.permittedActions.includes(Actions.MEDIA_FILE_DELETE)) {
			actions.push({
				label: t('grid.action.deleteFile'),
				name: Actions.MEDIA_FILE_DELETE,
				icon: 'Cancel',
				isWarnable: true,
			});
		}
		return actions;
	}

	return {
		getColumns,
		getTopItems,
		getItemActions,
		getManagerConfig,
		mediaTypeOptions,
		supportedFileTypesLabel,
	};
}
