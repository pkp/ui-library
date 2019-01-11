<script>
import Example from '@/docs/Example.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		FieldText
	},
	data() {
		return {
			...config,
			component: 'field-text',
			listeners: {
				change: this.change
			}
		};
	},
	methods: {
		change(data) {
			if (data.localeKey) {
				this.props.value[data.localeKey] = data.value;
			} else {
				this.props.value = data.value;
			}
		}
	}
};
</script>
