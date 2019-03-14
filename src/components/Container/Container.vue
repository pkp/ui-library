<script type="text/javascript">
import PkpForm from '@/components/Form/Form.vue';
import ListPanel from '@/components/ListPanel/ListPanel.vue';
import SelectReviewerListPanel from '@/components/ListPanel/users/SelectReviewerListPanel.vue';
import SelectSubmissionsListPanel from '@/components/ListPanel/submissions/SelectSubmissionsListPanel.vue';
import SubmissionsListPanel from '@/components/ListPanel/submissions/SubmissionsListPanel.vue';

export default {
	name: 'Container',
	components: {
		PkpForm,
		ListPanel,
		SelectReviewerListPanel,
		SelectSubmissionsListPanel,
		SubmissionsListPanel
	},
	data() {
		return {
			components: {}
		};
	},
	methods: {
		/**
		 * Get a component by its key
		 *
		 * @param string key
		 * @return Object
		 */
		get(key) {
			return this.components[key] ? this.components[key] : {};
		},

		/**
		 * Set data for a component
		 *
		 * Existing keys in the component that are not passed in the data
		 * argument will not be modified or removed.
		 *
		 * @param string key
		 * @param array data Key/value object with new data
		 */
		set: function(key, data) {
			let component = {...this.get(key)};
			Object.keys(data).forEach(function(dataKey) {
				component[dataKey] = data[dataKey];
			});
			this.components[key] = component;
		}
	},
	mounted: function() {
		/**
		 * Listen for changes in the supported form languages and update
		 * form components
		 */
		pkp.eventBus.$on('set-form-languages', data => {
			let supportedFormLocales;
			// Account for global events triggered from Handler.js, which attaches
			// non-numeric keys to the event data, changing the array to an object
			if (!Array.isArray(data)) {
				supportedFormLocales = {...data};
				if (supportedFormLocales.isGlobalEvent) {
					delete supportedFormLocales.isGlobalEvent;
				}
				if (supportedFormLocales.handler) {
					delete supportedFormLocales.handler;
				}
				supportedFormLocales = Object.values(supportedFormLocales);
			} else {
				supportedFormLocales = [...data];
			}

			Object.keys(this.components).forEach(key => {
				if (typeof this.components[key].supportedFormLocales !== 'undefined') {
					this.components[key].supportedFormLocales = supportedFormLocales;
				}
			});
		});
	}
};
</script>
