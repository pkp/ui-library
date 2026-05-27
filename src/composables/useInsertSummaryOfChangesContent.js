import {useModal} from '@/composables/useModal';
import {useForm} from '@/composables/useForm';
import {useLocalize} from '@/composables/useLocalize';
import {useApp} from '@/composables/useApp';
import InsertSummaryOfChangesModal from '@/components/InsertSummaryOfChanges/InsertSummaryOfChangesModal.vue';

export function useInsertSummaryOfChangesContent(
	form,
	fieldName,
	submissionId,
	reviewRounds = [],
) {
	const {getField, getValue, setValue} = useForm(form);
	const {openSideModal, closeSideModal} = useModal();
	const {t} = useLocalize();
	const {getCurrentLocale, getPrimaryLocale} = useApp();
	const primaryLocale = getPrimaryLocale();

	const field = getField(fieldName);
	if (!field) return;

	// One TinyMCE editor per locale, captured so we can fan inserts across all of them.
	const editorsByLocale = {};

	field.toolbar = `${field.toolbar || ''} | insertcontent`.trim();

	field.init = {
		...(field.init || {}),
		setup: (editor) => {
			// editor.id from FieldBase.compileId: "<formId>-<name>-control-<locale>"
			const localeMatch = editor.id.match(/-control-(.+)$/);
			const locale = localeMatch ? localeMatch[1] : null;
			if (locale) {
				editorsByLocale[locale] = editor;
			}
			// Only the primary locale exposes the button; inserts fan out to all locales anyway.
			if (locale === primaryLocale) {
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
			currentLocale: getCurrentLocale(),
			onInsert: (summaryOfChangesByLocale) => {
				const current = getValue(fieldName) ?? {};
				const next = {...current};
				Object.entries(summaryOfChangesByLocale || {}).forEach(
					([locale, html]) => {
						if (!html) return;
						next[locale] = (current[locale] || '') + html;
					},
				);
				setValue(fieldName, next);
				closeSideModal(InsertSummaryOfChangesModal);
			},
		});
	}
}
