<script type="text/javascript">
import Container from './Container.vue';
import AddContextForm from '@/components/Form/context/AddContextForm.vue';
import EmailTemplatesListPanel from '@/components/ListPanel/emailTemplates/EmailTemplatesListPanel.vue';
import PkpForm from '@/components/Form/Form.vue';
import Tab from '@/components/Tabs/Tab.vue';
import Tabs from '@/components/Tabs/Tabs.vue';
import ThemeForm from '@/components/Form/context/ThemeForm.vue';

export default {
	name: 'SettingsContainer',
	extends: Container,
	components: {
		AddContextForm,
		EmailTemplatesListPanel,
		PkpForm,
		Tab,
		Tabs,
		ThemeForm
	},
	mounted() {
		pkp.eventBus.$on('form-success', (formId, context) => {
			if (
				[
					pkp.const.FORM_PAYMENT_SETTINGS,
					pkp.const.FORM_ANNOUNCEMENT_SETTINGS
				].includes(formId)
			) {
				window.location.reload(true);
			}
		});
	}
};
</script>
