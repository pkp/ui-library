<script type="text/javascript">
import Page from './Page.vue';
import AnnouncementsListPanel from '@/components/ListPanel/announcements/AnnouncementsListPanel.vue';
import InstitutionsListPanel from '@/components/ListPanel/institutions/InstitutionsListPanel.vue';
import PkpForm from '@/components/Form/Form.vue';
import ThemeForm from '@/components/Form/context/ThemeForm.vue';
import DateTimeForm from '@/components/Form/context/DateTimeForm.vue';
import DoiSetupSettingsForm from '@/components/Form/context/DoiSetupSettingsForm.vue';
import DoiRegistrationSettingsForm from '@/components/Form/context/DoiRegistrationSettingsForm.vue';

export default {
	name: 'SettingsPage',
	extends: Page,
	components: {
		AnnouncementsListPanel,
		InstitutionsListPanel,
		PkpForm,
		ThemeForm,
		DateTimeForm,
		DoiSetupSettingsForm,
		DoiRegistrationSettingsForm,
	},
	data() {
		return {
			announcementsNavLink: {},
			institutionsNavLink: {},
			paymentsNavLink: null,
		};
	},
	mounted() {
		pkp.eventBus.$on('form-success', (formId, context) => {
			// Add or remove payments nav link
			if (
				formId === pkp.const.FORM_PAYMENT_SETTINGS &&
				!!this.paymentsNavLink
			) {
				if (!context.paymentsEnabled && !!this.menu['payments']) {
					let menu = {...this.menu};
					delete menu.payments;
					this.menu = menu;
				} else if (
					context.paymentsEnabled &&
					!Object.keys(this.menu).includes('payments')
				) {
					let menu = {};
					Object.keys(this.menu).forEach((key) => {
						if (key === 'settings') {
							menu.institutions = this.institutionsNavLink;
							menu.payments = this.paymentsNavLink;
						}
						menu[key] = this.menu[key];
					});
					this.menu = menu;
				}
			}

			// Add or remove institutions nav link
			if (formId === pkp.const.FORM_CONTEXT_STATISTICS) {
				if (
					!context.enableInstitutionUsageStats &&
					!this.menu['payments'] &&
					!!this.menu['institutions']
				) {
					let menu = {...this.menu};
					delete menu.institutions;
					this.menu = menu;
				} else if (
					context.enableInstitutionUsageStats &&
					!Object.keys(this.menu).includes('institutions')
				) {
					let menu = {};
					Object.keys(this.menu).forEach((key) => {
						if (key === 'settings' || key === 'payments') {
							menu.institutions = this.institutionsNavLink;
						}
						menu[key] = this.menu[key];
					});
					this.menu = menu;
				}
			}

			// Add or remove announcements nav link
			if (formId === pkp.const.FORM_ANNOUNCEMENT_SETTINGS) {
				if (!context.enableAnnouncements && !!this.menu['announcements']) {
					let menu = {...this.menu};
					delete menu.announcements;
					this.menu = menu;
				} else if (
					context.enableAnnouncements &&
					!Object.keys(this.menu).includes('announcements')
				) {
					let menu = {};
					Object.keys(this.menu).forEach((key) => {
						if (
							key === 'settings' ||
							key === 'payments' ||
							key === 'institutions'
						) {
							menu.announcements = this.announcementsNavLink;
						}
						menu[key] = this.menu[key];
					});
					this.menu = menu;
				}
			}

			// Update allowed pubObjects for DOI assignment on registration agency change
			if (formId === pkp.const.FORM_DOI_REGISTRATION_SETTINGS) {
				const newlyEnabledPlugin = context.registrationAgency;
				const existingPlugin =
					this.components.doiSetupSettings.enabledRegistrationAgency;

				if (newlyEnabledPlugin !== existingPlugin) {
					this.components.doiSetupSettings.enabledRegistrationAgency =
						newlyEnabledPlugin;

					this.components.doiSetupSettings.fields =
						this.components.doiSetupSettings.fields.map((field) => {
							if (field.name === 'enabledDoiTypes') {
								field.options =
									this.components.doiSetupSettings.objectTypeOptions.filter(
										(option) => {
											return newlyEnabledPlugin === null
												? true
												: option.allowedBy.includes(newlyEnabledPlugin);
										}
									);

								let fieldValues = field.value;
								field.value = fieldValues.filter((value) => {
									return field.options.some((option) => option.value === value);
								});
							}

							return field;
						});
				}
			}
		});
	},
	destroyed() {
		pkp.eventBus.$off('form-success');
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkp_page_management .app__page > .pkpNotification {
	margin-bottom: 2rem;
}
</style>
