<template>
	<div class="pkpFormField pkpFormField--date">
		<div class="pkpFormField__heading">
			<FormFieldLabel
				:control-id="controlId"
				:label="label"
				:locale-label="localeLabel"
				:is-required="isRequired"
				:required-label="t('common.required')"
				:multilingual-label="multilingualLabel"
				class="align-middle"
			/>
			<Tooltip
				v-if="isPrimaryLocale && tooltip"
				aria-hidden="true"
				:tooltip="tooltip"
				label=""
			/>
			<span
				v-if="isPrimaryLocale && tooltip"
				:id="describedByTooltipId"
				v-strip-unsafe-html="tooltip"
				class="-screenReader"
			/>
		</div>

		<div
			v-if="isPrimaryLocale && description"
			:id="describedByDescriptionId"
			v-strip-unsafe-html="description"
			class="pkpFormField__description semantic-defaults"
		/>

		<div class="pkpFormField__control">
			<input
				:id="controlId"
				ref="input"
				v-model="currentValue"
				type="date"
				:name="localizedName"
				:aria-describedby="describedByIds"
				:aria-invalid="!!errors?.length"
				:disabled="disabled"
				:required="isRequired"
				:min="computedMin"
				:max="computedMax"
				class="pkpFormField__input"
			/>
			<FieldError
				v-if="errors && errors.length"
				:id="describedByErrorId"
				:messages="errors"
			/>
		</div>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';

export default {
	name: 'FieldDate',
	components: {
		Tooltip,
	},
	extends: FieldBase,
	props: {
		/** Minimum date, can be 'today', 'tomorrow', 'yesterday', or YYYY-MM-DD */
		min: {
			type: String,
			default: null,
		},
		/** Maximum date, can be 'today', 'tomorrow', 'yesterday', or YYYY-MM-DD */
		max: {
			type: String,
			default: null,
		},
		/** If the field is disabled */
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		computedMin() {
			const minDate = this.resolveDate(this.min);
			const maxDate = this.resolveDate(this.max);
			if (minDate && maxDate && minDate > maxDate) {
				console.warn(
					`[FieldDate] min (${minDate}) is after max (${maxDate}). Ignoring min.`,
				);
				return null;
			}
			return minDate;
		},
		computedMax() {
			const minDate = this.resolveDate(this.min);
			const maxDate = this.resolveDate(this.max);
			if (minDate && maxDate && minDate > maxDate) {
				console.warn(
					`[FieldDate] max (${maxDate}) is before min (${minDate}). Ignoring max.`,
				);
				return null;
			}
			return maxDate;
		},
	},
	methods: {
		/** Resolve relative date keywords to YYYY-MM-DD */
		resolveDate(value) {
			if (!value) return undefined;
			const today = new Date();

			if (value instanceof Date) return value.toISOString().split('T')[0];

			switch (value.toLowerCase()) {
				case 'today':
					return today.toISOString().split('T')[0];
				case 'tomorrow': {
					const t = new Date();
					t.setDate(today.getDate() + 1);
					return t.toISOString().split('T')[0];
				}
				case 'yesterday': {
					const t = new Date();
					t.setDate(today.getDate() - 1);
					return t.toISOString().split('T')[0];
				}
				default:
					// Accept literal YYYY-MM-DD
					if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
					return undefined;
			}
		},
	},
};
</script>
