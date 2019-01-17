<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldHtml from '@/components/Form/fields/FieldHtml.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldHtml
	},
	data() {
		return {
			...config,
			props: {
				...config.props,
				label: 'Lorem Ipsum',
				description:
					'<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do <a href="#">eiusmod tempor</a> incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>'
			},
			component: 'field-html'
		};
	}
};
</script>
