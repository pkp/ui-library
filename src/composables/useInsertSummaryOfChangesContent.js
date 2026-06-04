import {useModal} from '@/composables/useModal';
import {useForm} from '@/composables/useForm';
import {useLocalize} from '@/composables/useLocalize';
import InsertSummaryOfChangesModal from '@/components/InsertSummaryOfChanges/InsertSummaryOfChangesModal.vue';

export function useInsertSummaryOfChangesContent(
	form,
	fieldName,
	submissionData = {},
) {
	const {
		id: submissionId,
		reviewRounds,
		locale: submissionLocale,
	} = submissionData;
	const {getField, getValue, setValue} = useForm(form);
	const {openSideModal, closeSideModal} = useModal();
	const {t} = useLocalize();

	const field = getField(fieldName);
	if (!field) return;

	field.toolbar = `${field.toolbar || ''} | insertcontent`.trim();

	field.init = {
		...(field.init || {}),
		setup: (editor) => {
			// editor.id from FieldBase.compileId: "<formId>-<name>-control-<locale>"
			const localeMatch = editor.id.match(/-control-(.+)$/);
			const locale = localeMatch ? localeMatch[1] : null;
			// Only the submission (primary) locale exposes the button; the revision
			// summary is a single value and is inserted into that locale. The editor
			// translates the other locales of the multilingual publication field.
			if (locale === submissionLocale) {
				editor.ui.registry.addButton('insertcontent', {
					text: t('common.insertContent'),
					onAction: () => openInsertModal(),
				});
			}
		},
	};

	function openInsertModal() {
		openSideModal(InsertSummaryOfChangesModal, {
			submissionId,
			reviewRounds,
			submissionLocale,
			onInsert: (html) => {
				if (html) {
					const current = getValue(fieldName) ?? {};
					setValue(fieldName, {
						...current,
						[submissionLocale]: (current[submissionLocale] || '') + html,
					});
				}
				closeSideModal(InsertSummaryOfChangesModal);
			},
		});
	}
}
