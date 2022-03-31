<script type="text/javascript">
import Page from '@/components/Container/Page.vue';
import ThemeForm from '@/components/Form/context/ThemeForm.vue';
import ActionPanel from '../ActionPanel/ActionPanel.vue';

export default {
	extends: Page,
	name: 'AdminPage',
	components: {
		ActionPanel,
		ThemeForm
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkp_page_admin {
	.pkpNotification {
		margin-bottom: 2rem;
	}

	.actionPanel {
		margin-bottom: 1.5rem;
		padding: 1rem;
		border: @bg-border-light;
		border-radius: @radius;
		background: @lift;
	}

	// Account for <form> wrappers around some actions
	.actionPanel__actions form + form {
		margin-top: 0.25rem;
	}

	.app__contentPanel {
		font-size: @font-sml;
		line-height: 1.6em;

		h2 {
			margin-bottom: 0.5rem;
			font-size: @font-base;
			line-height: 1.6em;
		}

		h2:first-child {
			margin-top: 0;
		}

		.app--admin__systemInfoGroup {
			font-weight: @bold;
		}
	}
}
</style>
