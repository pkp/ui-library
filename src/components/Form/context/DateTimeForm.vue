<script>
import {DateTime} from 'luxon';
import PkpForm from '../Form.vue';
import {getLuxonLocale, formatDateWithPhpFormat} from '@/utils/dateUtils';

export default {
	name: 'DateTimeForm',
	extends: PkpForm,
	data() {
		return {
			// holds initial value of the field that emitted set event
			fieldBeforeSetEvent: {
				name: null,
				value: null,
			},
		};
	},
	mounted() {
		this.$nextTick(function () {
			const dateTimeNow = DateTime.now();
			this.fields.forEach((field) => {
				this.availableLocales.forEach((locale) => {
					dateTimeNow.setLocale(getLuxonLocale(locale.key));
					field.options[locale.key].forEach((option) => {
						if (option.isInput) {
							return;
						}
						const formattedDate = formatDateWithPhpFormat(
							dateTimeNow,
							option.label,
							locale.key,
						);
						if (formattedDate) {
							option.label = formattedDate;
						}
					});
				});
			});
		});
	},
	methods: {
		/**
		 * Update label and value of the dateTimeFormatShort and
		 * dateTimeFormatLong based on the date and time input
		 *
		 * @param {String} name
		 * @param {String} prop
		 * @param {String} value
		 * @param {String|null} localeKey
		 */
		fieldChanged: function (name, prop, value, localeKey) {
			// Update changed value
			let newFields = this.fields.map((field) => {
				if (field.name === name) {
					this.fieldBeforeSetEvent.name = name;
					this.fieldBeforeSetEvent.value = field[prop][localeKey];
					field[prop][localeKey] = value;
				}

				return field;
			});

			if (
				!['dateFormatShort', 'dateFormatLong', 'timeFormat'].find(
					(fieldName) => fieldName === name,
				)
			) {
				this.$emit('set', this.id, {fields: newFields});
				return;
			}

			const shortDate = this.fields.find(
				(field) => field.name === 'dateFormatShort',
			);
			const longDate = this.fields.find(
				(field) => field.name === 'dateFormatLong',
			);
			const time = this.fields.find((field) => field.name === 'timeFormat');

			// Determine value for the short and long date & time fields
			let shortDateTimeValue = {
				date: shortDate.value[localeKey],
				time: time.value[localeKey],
			};
			let longDateTimeValue = {
				date: longDate.value[localeKey],
				time: time.value[localeKey],
			};

			// Change value based on a new input
			if (name === 'dateFormatShort') {
				shortDateTimeValue.date = value;
			} else if (name === 'dateFormatLong') {
				longDateTimeValue.date = value;
			} else if (name === 'timeFormat') {
				shortDateTimeValue.time = value;
				longDateTimeValue.time = value;
			}

			// Determine labels for the short and long date & time fields
			const shortDateOption = shortDate.options[localeKey].find(
				(option) => option.value === shortDate.value[localeKey],
			);
			const longDateOption = longDate.options[localeKey].find(
				(option) => option.value === longDate.value[localeKey],
			);
			const timeOption = time.options[localeKey].find(
				(option) => option.value === time.value[localeKey],
			);

			// If there isn't label for the date or time in case of custom input, use latter as a label
			let shortDateTimeLabel =
				shortDateOption && timeOption
					? {date: shortDateOption.label, time: timeOption.label}
					: shortDateTimeValue;

			let longDateTimeLabel =
				longDateOption && timeOption
					? {date: longDateOption.label, time: timeOption.label}
					: longDateTimeValue;

			newFields = this.updateFields(
				newFields,
				name,
				localeKey,
				{value: shortDateTimeValue, label: shortDateTimeLabel},
				{value: longDateTimeValue, label: longDateTimeLabel},
			);

			this.$emit('set', this.id, {fields: newFields});
		},

		/**
		 * Provide actual update of the fields, update value only if predefined radio input is selected
		 *
		 * @param {Array} newFields - contains updated field on set event
		 * @param {String} name - string name of the field that emits event
		 * @param {String} localeKey - locale of the field that emits event
		 * @param {Object} shortDateTime - new label and value for the short date and time field
		 * @param {Object} longDateTime - new label and value for the short date and time field
		 * @return {Array} updated fields
		 */
		updateFields: function (
			newFields,
			name,
			localeKey,
			shortDateTime,
			longDateTime,
		) {
			return newFields.map((field) => {
				if (
					(name === 'dateFormatShort' || name === 'timeFormat') &&
					field.name === 'datetimeFormatShort'
				) {
					// Contains initial value of the datetimeFormatShort composed from date and time fields,
					// needed to determine value selected by a user (predefined vs custom)
					let suggestedOldValue =
						name === 'dateFormatShort'
							? this.fieldBeforeSetEvent.value + ' ' + shortDateTime.value.time
							: shortDateTime.value.date + ' ' + this.fieldBeforeSetEvent.value;

					// Update value only if it refers to the option selected
					if (suggestedOldValue === field.value[localeKey]) {
						field.value[localeKey] =
							shortDateTime.value.date + ' ' + shortDateTime.value.time;
					}

					field.options[localeKey][0].label =
						shortDateTime.label.date + ' ' + shortDateTime.label.time;
				}

				if (
					(name === 'dateFormatLong' || name === 'timeFormat') &&
					field.name === 'datetimeFormatLong'
				) {
					let suggestedOldValue =
						name === 'dateFormatLong'
							? this.fieldBeforeSetEvent.value + ' - ' + longDateTime.value.time
							: longDateTime.value.date +
								' - ' +
								this.fieldBeforeSetEvent.value;

					if (suggestedOldValue === field.value[localeKey]) {
						field.value[localeKey] =
							longDateTime.value.date + ' - ' + longDateTime.value.time;
					}

					field.options[localeKey][0].label =
						longDateTime.label.date + ' - ' + longDateTime.label.time;
				}

				return field;
			});
		},
	},
};
</script>
