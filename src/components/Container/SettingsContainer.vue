<script type="text/javascript">
import Container from './Container.vue';
import AddContextForm from '@/components/Form/context/AddContextForm.vue';
import EmailTemplatesListPanel from '@/components/ListPanel/emailTemplates/EmailTemplatesListPanel.vue';
import LicenseForm from '@/components/Form/context/LicenseForm.vue';
import PkpForm from '@/components/Form/Form.vue';
import ThemeForm from '@/components/Form/context/ThemeForm.vue';

export default {
	name: 'SettingsContainer',
	extends: Container,
	components: {
		AddContextForm,
		EmailTemplatesListPanel,
		LicenseForm,
		PkpForm,
		ThemeForm
	}
};
</script>
