<script type="text/javascript">
import Page from '@/components/Container/Page.vue';
import ThemeForm from '@/components/Form/context/ThemeForm.vue';

export default {
	extends: Page,
	name: 'AdminPage',
	components: {
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

		h3 {
			margin-bottom: 0.5rem;
		}

		ul {
			margin: 0;
			padding: 0;
			list-style: none;
		}

		li {
			padding: 0.25em 0;
		}

		ul + h2 {
			margin-top: 1rem;
		}

		.app--admin__systemInfoGroup {
			font-weight: @bold;
		}
	}
}
</style>
