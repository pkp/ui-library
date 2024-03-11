<template>
	<p>{{ t('submission.list.changeLangDescription') }}</p>
	<div class="pkpPublication" aria-live="polite">
		<pkp-form
			v-bind="form"
			@set="updateFormData"
			@success="changeLanguage"
		></pkp-form>
	</div>
</template>

<script type="text/javascript">
import PkpForm from '@/components/Form/Form.vue';
import ajaxError from '@/mixins/ajaxError';
import cloneDeep from 'clone-deep';

export default {
	name: 'ChangeSubmissionLanguage',
	components: {
		PkpForm,
	},
	mixins: [ajaxError],
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
		submissionApiUrl: {
			type: String,
			required: true,
		},
		submissionLocale: {
			type: String,
			required: true,
		},
	},
	emits: ['set', 'updated:contributors', 'updated:form', 'updated:locale'],
	data() {
		return {
			form: null,
			isSubmit: false,
		};
	},
	created() {
		this.form = cloneDeep(this.cslmform);
	},
	methods: {
		/**
		 * Change submission language and update contributor props
		 */
		async changeLanguage() {
			const oldLocale = this.submissionLocale;
			const newLocale = this.form.primaryLocale;
			if (newLocale === oldLocale) {
				return Promise.resolve();
			}
			this.isSubmit = true;
			const self = this;
			return editContributors().then(
				submitLang().then(async () => {
					self.isSubmit = false;
					self.updateForm();
					return Promise.resolve();
				}, $.noop),
				$.noop,
			);

			async function editContributors() {
				const editedContributors = self.contributors
					.map((a) => [a.id, edit(a)])
					.filter((a) => Object.keys(a[1]).length > 0);
				if (editedContributors.length > 0) {
					return $.when(
						...editedContributors.map(([id, contributor]) => {
							return send(`${self.contributorsApiUrl}/${id}`, contributor);
						}),
					).then(() => {
						self.$emit(
							'updated:contributors',
							self.contributors.map((c) =>
								Object.assign(
									c,
									editedContributors.find(([id]) => id === c.id)[1],
								),
							),
						);
					});
				}
				return Promise.resolve();

				function edit(author) {
					// Only edit if given name empty
					if (author['givenName'][newLocale] !== '') return {};
					return ['givenName', 'familyName', 'preferredPublicName'].reduce(
						(editedProps, prop) => {
							if (author[prop][newLocale] === '') {
								editedProps[prop] = {[newLocale]: author[prop][oldLocale]};
							}
							return editedProps;
						},
						{},
					);
				}
			}

			async function submitLang() {
				return send(self.submissionApiUrl, {locale: newLocale}, (_) =>
					self.$emit('updated:locale', newLocale),
				);
			}

			async function send(url, data, success = $.noop) {
				return $.ajax({
					url: url,
					method: 'POST',
					headers: {
						'X-Csrf-Token': pkp.currentUser.csrfToken,
						'X-Http-Method-Override': 'PUT',
					},
					data: data,
					success(r) {
						success(r);
					},
					error(r) {
						self.ajaxErrorCallback(r);
					},
				});
			}
		},

		/**
		 * Update form
		 */
		updateForm() {
			const form = cloneDeep(this.form);
			const locale = form.primaryLocale;
			const showWhen = form.supportedFormLocales
				.filter(({key}) => key !== locale)
				.map(({key}) => key);
			form.groups.forEach((g) => {
				if (typeof g.showWhen !== 'undefined') g.showWhen[1] = showWhen;
			});
			form.fields[0].value = locale;
			this.form = form;
			this.$emit('updated:form', form);
		},

		/**
		 * Update form data
		 */
		updateFormData(_, data) {
			const self = this;
			Object.keys(data).forEach(function (key) {
				self.form[key] = data[key];

				const newLocale = data.fields?.[0].value ?? self.form.primaryLocale;
				if (newLocale !== self.form.primaryLocale && !self.isSubmit) {
					self.form.primaryLocale = newLocale;
					self.form.visibleLocales = [newLocale];
				}
			});
		},
	},
};
</script>

<style lang="less">
// Hide formlocales of change language metadata form
#changeSubmissionLanguage form .pkpFormLocales {
	display: none;
}
</style>
