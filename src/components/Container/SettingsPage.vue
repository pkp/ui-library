<script type="text/javascript">
import Page from './Page.vue';
import AnnouncementsListPanel from '@/components/ListPanel/announcements/AnnouncementsListPanel.vue';
import EmailTemplatesListPanel from '@/components/ListPanel/emailTemplates/EmailTemplatesListPanel.vue';
import PkpForm from '@/components/Form/Form.vue';
import ThemeForm from '@/components/Form/context/ThemeForm.vue';
import DateTimeForm from '@/components/Form/context/DateTimeForm.vue';
import DoiSettingsForm from '@/components/Form/context/DoiSettingsForm';

export default {
	name: 'SettingsPage',
	extends: Page,
	components: {
		AnnouncementsListPanel,
		EmailTemplatesListPanel,
		PkpForm,
		ThemeForm,
		DateTimeForm,
		DoiSettingsForm
	},
	data() {
		return {
			announcementsNavLink: {},
			paymentsNavLink: null
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
					Object.keys(this.menu).forEach(key => {
						if (key === 'settings') {
							menu.payments = this.paymentsNavLink;
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
					Object.keys(this.menu).forEach(key => {
						if (key === 'settings' || key === 'payments') {
							menu.announcements = this.announcementsNavLink;
						}
						menu[key] = this.menu[key];
					});
					this.menu = menu;
				}
			}
		});
	},
	destroyed() {
		pkp.eventBus.$off('form-success');
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkp_page_management .app__page > .pkpNotification {
	margin-bottom: 2rem;
}
</style>
