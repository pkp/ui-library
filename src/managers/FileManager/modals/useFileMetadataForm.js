import {useForm} from '@/composables/useForm';
import {useFetch, getCSRFToken} from '@/composables/useFetch';
import {useLocalize} from '@/composables/useLocalize';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';

export function useFileMetadataForm({
	submissionFile,
	genreCategory,
	supportedLocales,
	primaryLocale,
	stageId,
	reviewRoundId,
	showButtons,
}) {
	const {t} = useLocalize();

	const {url: saveFileMetadataUrl} = useLegacyGridUrl({
		component: 'api.file.ManageFileApiHandler',
		op: 'saveMetadata',
		params: {
			submissionId: submissionFile.submissionId,
			submissionFileId: submissionFile.id,
			fileStage: submissionFile.fileStage,
			stageId,
			reviewRoundId,
		},
	});

	function buildFormData(submitValues) {
		const body = new FormData();
		// CSRF goes in the body - saveMetadata reads it from POST, not the header.
		body.append('csrfToken', getCSRFToken());
		Object.entries(submitValues || {}).forEach(([name, value]) => {
			if (value && typeof value === 'object' && !Array.isArray(value)) {
				Object.entries(value).forEach(([locale, localeValue]) => {
					body.append(`${name}[${locale}]`, localeValue ?? '');
				});
			} else if (value !== undefined && value !== null) {
				body.append(name, value);
			}
		});
		return body;
	}

	async function handleCustomSubmit(submitValues) {
		const {
			data,
			fetch: doFetch,
			isSuccess,
		} = useFetch(saveFileMetadataUrl.value, {
			method: 'POST',
			body: buildFormData(submitValues),
		});
		await doFetch();

		// Empty 'content' in the JSONMessage response = success; non-empty = re-rendered form with validation errors.
		if (isSuccess.value && data.value && !data.value.content) {
			return {data: data.value};
		}
		// Legacy saveMetadata returns the re-rendered form HTML in `content` on validation failure.
		// Trigger notifyUser so the modal's NotificationHandler runs fetchNotification, matching the legacy form's behaviour.
		$('[data-submission-file-metadata-wrapper]').trigger('notifyUser');
		return {};
	}

	const {
		form,
		set,
		initEmptyForm,
		addPage,
		addGroup,
		addFieldText,
		addFieldTextArea,
		addFieldRichTextArea,
		addFieldDate,
	} = useForm({}, {customSubmit: handleCustomSubmit});

	initEmptyForm('submissionFileMetadataForm', {
		action: '',
		method: 'POST',
		locales: supportedLocales,
	});
	form.value.primaryLocale = primaryLocale;

	addPage('default', {
		submitButton: showButtons ? {label: t('common.save')} : null,
		cancelButton: showButtons ? {label: t('common.cancel')} : null,
	});
	addGroup('default', {pageId: 'default'});

	addFieldText('name', {
		groupId: 'default',
		label: t('submission.form.name'),
		isMultilingual: true,
		isRequired: true,
		size: 'large',
		value: submissionFile.name || {},
	});

	if (submissionFile.fileStage === pkp.const.SUBMISSION_FILE_REVIEW_REVISION) {
		addFieldRichTextArea('summaryOfChanges', {
			groupId: 'default',
			label: t('submission.form.summaryOfChanges'),
			description: t('submission.form.summaryOfChanges.description'),
			isMultilingual: true,
			value: submissionFile.summaryOfChanges || {},
		});
	}

	if (genreCategory === pkp.const.GENRE_CATEGORY_SUPPLEMENTARY) {
		addGroup('supplementary', {pageId: 'default'});
		addFieldTextArea('description', {
			groupId: 'supplementary',
			label: t('common.description'),
			isMultilingual: true,
			size: 'small-height',
			value: submissionFile.description || {},
		});
		addFieldText('creator', {
			groupId: 'supplementary',
			label: t('submission.supplementary.creator'),
			isMultilingual: true,
			value: submissionFile.creator || {},
		});
		addFieldText('publisher', {
			groupId: 'supplementary',
			label: t('submission.supplementary.publisher'),
			isMultilingual: true,
			value: submissionFile.publisher || {},
		});
		addFieldText('source', {
			groupId: 'supplementary',
			label: t('common.source'),
			isMultilingual: true,
			value: submissionFile.source || {},
		});
		addFieldText('subject', {
			groupId: 'supplementary',
			label: t('submission.supplementary.subject'),
			isMultilingual: true,
			value: submissionFile.subject || {},
		});
		addFieldText('sponsor', {
			groupId: 'supplementary',
			label: t('submission.supplementary.sponsor'),
			isMultilingual: true,
			value: submissionFile.sponsor || {},
		});
		addFieldDate('dateCreated', {
			groupId: 'supplementary',
			label: t('common.date'),
			value: submissionFile.dateCreated,
		});
		addFieldText('language', {
			groupId: 'supplementary',
			label: t('common.language'),
			value: submissionFile.language,
		});
	}

	if (genreCategory === pkp.const.GENRE_CATEGORY_ARTWORK) {
		// POST keys are `artwork*`; the DB columns are caption/credit/etc.
		addGroup('artwork', {pageId: 'default'});
		addFieldTextArea('artworkCaption', {
			groupId: 'artwork',
			label: t('grid.artworkFile.caption'),
			size: 'small-height',
			value: submissionFile.caption,
		});
		addFieldTextArea('artworkCredit', {
			groupId: 'artwork',
			label: t('grid.artworkFile.credit'),
			size: 'small-height',
			value: submissionFile.credit,
		});
		addFieldTextArea('artworkCopyrightOwner', {
			groupId: 'artwork',
			label: t('grid.artworkFile.copyrightOwner'),
			size: 'small-height',
			value: submissionFile.copyrightOwner,
		});
		addFieldTextArea('artworkPermissionTerms', {
			groupId: 'artwork',
			label: t('grid.artworkFile.permissionTerms'),
			size: 'small-height',
			value: submissionFile.terms,
		});
	}

	return {form, set};
}
