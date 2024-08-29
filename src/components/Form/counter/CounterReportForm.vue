<script>
import PkpForm from '@/components/Form/Form.vue';

export default {
	name: 'CounterReportForm',
	extends: PkpForm,
	components: {
		PkpForm,
	},
	props: {
		reportId: {
			type: String,
			required: false,
		},
		reportFields: {
			type: Array,
			required: true,
		},
		earliestDate: {
			type: String,
			required: true,
		},
		lastDate: {
			type: String,
			required: true,
		},
	},
	methods: {
		/**
		 * Get the report parameters
		 *
		 * @param Object
		 * @return Object
		 */
		getReportParams(formSubmitValues) {
			let params = {};
			for (const [key, value] of Object.entries(formSubmitValues)) {
				switch (key) {
					case 'customer_id':
						if (parseInt(value, 10) >= 0) {
							params[key] = value;
						}
						break;
					case 'begin_date':
					case 'end_date':
					case 'yop':
					case 'item_id':
						if (value != null && value.length > 0) {
							params[key] = value;
						}
						break;
					case 'metric_type':
					case 'attributes_to_show':
						if (value != null && value.length > 0) {
							params[key] = value.join('|');
						}
						break;
					case 'include_parent_details':
						if (value == true) {
							params.include_parent_details = 'True';
						}
						break;
					case 'granularity':
						if (value == true) {
							params.granularity = 'Totals';
						}
						break;
				}
			}
			return params;
		},

		/**
		 * Submit the form
		 */
		submit() {
			if (!this.canSubmit) {
				return false;
			}

			let errors = this.validate();
			if (Object.keys(errors).length) {
				this.$emit('set', this.id, {
					errors: {
						...this.errors,
						...errors,
					},
				});
				return;
			}

			this.isSaving = true;

			$.ajax({
				context: this,
				method: this.method,
				url: this.action,
				headers: {
					Accept: 'text/tab-separated-values; charset=utf-8',
				},
				data: this.getReportParams(this.submitValues),
				error(r) {
					this.isSaving = false;
					if (r.status && r.status === 400) {
						if (r.responseJSON.hasOwnProperty('Code')) {
							// COUNTER speific errors should actually not occur
							// because of the form/user input validation
							// but consider them for any case as well.
							pkp.eventBus.$emit(
								'notify',
								r.responseJSON.Code +
									':' +
									r.responseJSON.Message +
									'(' +
									r.responseJSON.Data +
									')',
								'warning'
							);
						} else {
							// Field validation errors
							this.$emit('set', this.id, {errors: r.responseJSON});
						}
					} else {
						this.error(r);
					}
				},
				success(r) {
					this.$emit('success', r);
					var blob = new Blob([r]);
					var link = document.createElement('a');
					link.href = window.URL.createObjectURL(blob);
					link.download = 'counterReport.tsv';
					link.click();
					this.isSaving = false;
					pkp.eventBus.$emit('form-success', this.id, r);
				},
			});
		},
	},
};
</script>
