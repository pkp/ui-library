<template>
	<SideModalBody>
		<template #pre-title>
			{{ submission.id }}
		</template>
		<template #title>
			{{ t('submission.list.changeSubmissionLanguage.title') }}
		</template>
		<template #description>
			{{ publicationTitle }}
		</template>
		<div class="p-4">
			<div class="bg-secondary p-4">
				<div id="changeSubmissionLanguage" aria-live="polite">
					<pkp-form
						v-bind="state.form"
						@set="updateFormData"
						@success="changeLanguage"
					></pkp-form>
				</div>
			</div>
		</div>
	</SideModalBody>
</template>

<script type="text/javascript">
import {inject, reactive} from 'vue';
import PkpForm from '@/components/Form/Form.vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import {useModal} from '@/composables/useModal';
import {t} from '@/utils/i18n.js';
import cloneDeep from 'clone-deep';

export default {
	name: 'ChangeSubmissionLanguage',
	components: {
		PkpForm,
		SideModalBody,
	},
	props: {
		contributors: {
			type: Array,
			required: true,
		},
		contributorsApiUrl: {
			type: String,
			required: true,
		},
		cslmform: {
			type: Object,
			required: true,
		},
		publicationTitle: {
			type: String,
			required: true,
		},
		submission: {
			type: Object,
			required: true,
		},
		submissionApiUrl: {
			type: String,
			required: true,
		},
		submissionFileApiUrl: {
			type: String,
			required: true,
		},
	},
	emits: ['set', 'updated:contributors', 'updated:files', 'updated:submission'],
	setup(props, {emit}) {
		/**
		 * Variables
		 */

		const state = reactive({
			form: cloneDeep(props.cslmform),
		});
		const CONTRIBUTOR_PROPS_NAMES = [
			'givenName',
			'familyName',
			'preferredPublicName',
		];
		const SUBMISSION_FILE_PROPS_EDIT = ['name'];
		let isSubmit = false;

		/**
		 * Functions
		 */

		const closeModal = inject('closeModal');
		const {openDialog} = useModal();

		/**
		 * Change submission language and update contributor and submission file props
		 * Emit updated
		 */
		const changeLanguage = async () => {
			const oldLocale = props.submission.locale;
			const newLocale = state.form.primaryLocale;
			if (newLocale === oldLocale) {
				return Promise.resolve(1);
			}
			let updatedSubmission = null;
			isSubmit = true;
			try {
				await Promise.all([editContributors(), editSubmissionFiles()]);
				updatedSubmission = await editLanguage();
			} catch (r) {
				ajaxError(r);
			}
			isSubmit = false;
			updateForm(updatedSubmission);
			closeModal();
			return Promise.resolve(1);

			/**
			 * Contributor props
			 */
			async function editContributors() {
				const url = (id) => `${props.contributorsApiUrl}/${id}`;
				await editSendEmit(
					props.contributors,
					edit,
					'updated:contributors',
					url,
				);
				// If needed in case of 'status: "rejected"', return Promise.reject(reason)
				return Promise.resolve(1);

				function edit(contributor) {
					// Only edit if given name empty
					if (contributor['givenName'][newLocale] !== '') return {};
					return CONTRIBUTOR_PROPS_NAMES.reduce((editedProps, prop) => {
						if (!contributor[prop][newLocale]) {
							editedProps[prop] = {[newLocale]: contributor[prop][oldLocale]};
						}
						return editedProps;
					}, {});
				}
			}

			/**
			 * Submission language
			 */
			async function editLanguage() {
				const submission = await send(props.submissionApiUrl, {
					locale: newLocale,
				});
				emit('updated:submission', submission);
				return submission;
			}

			/**
			 * Submission file props
			 */
			async function editSubmissionFiles() {
				const {items, stageIds} = await send(
					props.submissionFileApiUrl,
					{},
					'GET',
				);
				const url = (id) =>
					stageIds[id]
						? `${props.submissionFileApiUrl}/${id}?stageId=${stageIds[id]}`
						: '';
				await editSendEmit(items, edit, 'updated:files', url);
				// If needed in case of 'status: "rejected"', return Promise.reject(reason)
				return Promise.resolve(1);

				function edit(file) {
					return SUBMISSION_FILE_PROPS_EDIT.reduce((editedProps, prop) => {
						if (!file[prop][newLocale]) {
							editedProps[prop] = {[newLocale]: file[prop][oldLocale]};
						}
						return editedProps;
					}, {});
				}
			}

			/**
			 * Aux functions
			 */

			function ajaxError(r) {
				if (r?.status) {
					openDialog({
						name: 'ajaxError',
						title: t('common.error'),
						message: r.responseJSON?.errorMessage ?? t('common.unknownError'),
						actions: [{label: t('common.ok'), callback: (close) => close()}],
					});
				}
			}

			async function send(url, data, method = 'POST') {
				if (!url) return Promise.resolve({});
				return $.ajax({
					url: url,
					method: method,
					headers: {
						'X-Csrf-Token': pkp.currentUser.csrfToken,
						'X-Http-Method-Override': method === 'POST' ? 'PUT' : method,
					},
					data: data,
				});
			}

			/**
			 * Edit, send, and emit props
			 * Return array of objects: [{ status, value/reason }]
			 */
			async function editSendEmit(items, edit, emitName, url) {
				const editedProperties = items
					.map((item) => ({id: item.id, editedProps: edit(item)}))
					.filter(({editedProps}) => !!Object.keys(editedProps).length);
				if (!editedProperties.length) {
					return [];
				}
				const updatedItems = await Promise.allSettled(
					editedProperties.map(({id, editedProps}) =>
						send(url(id), editedProps),
					),
				);
				emit(
					emitName,
					items.map((item) => {
						const updated = updatedItems.find(
							({value}) => value?.id === item.id,
						);
						if (updated) return updated.value;
						return item;
					}),
				);
				return updatedItems;
			}

			/**
			 * Update and emit new form
			 */
			function updateForm(updatedSubmission) {
				const form = cloneDeep(state.form);
				const oldFormLocale = form.primaryLocale;
				const newFormLocale = updatedSubmission.locale ?? oldFormLocale;
				setFormLocale(form, newFormLocale, oldFormLocale);
				const showWhen = form.supportedFormLocales
					.filter(({key}) => key !== newFormLocale)
					.map(({key}) => key);
				form.groups.forEach((g) => {
					if (typeof g.showWhen !== 'undefined') g.showWhen[1] = showWhen;
				});
				form.fields[0].value = newFormLocale;
				state.form = form;
				pkp.eventBus.$emit('updated:change-submission-language:form', form);
			}
		};

		/**
		 * Update form data
		 */
		const updateFormData = (_, data) => {
			Object.keys(data).forEach(function (key) {
				state.form[key] = data[key];
				const oldLocale = state.form.primaryLocale;
				const newLocale = data.fields?.[0].value ?? oldLocale;
				if (newLocale !== oldLocale && !isSubmit) {
					setFormLocale(state.form, newLocale, oldLocale);
				}
			});
		};

		return {changeLanguage, state, updateFormData};

		/**
		 * Aux functions
		 */

		/**
		 * Set new locale as form primary locale
		 * Change language to descriptions
		 */
		function setFormLocale(form, newLocale, oldLocale) {
			form.primaryLocale = newLocale;
			form.visibleLocales = [newLocale];
			form.fields.forEach((f, i) => {
				if (f.groupId === 'metadata' && i) {
					// i18n.js t doesn't seem to support variable as tranlation key
					// (i18nExtractKeys.vite.js: uiLocaleKeysBackend.json), using str.replace for now.
					const oldLanguage = form.supportedFormLocales.find(
						({key}) => key === oldLocale,
					).label;
					const newLanguage = form.supportedFormLocales.find(
						({key}) => key === newLocale,
					).label;
					f.description = f.description.replace(oldLanguage, newLanguage);
				}
			});
		}
	},
};
</script>

<style lang="less">
// Hide formlocales of change language metadata form
#changeSubmissionLanguage form {
	.pkpFormLocales {
		display: none;
	}
}
</style>
