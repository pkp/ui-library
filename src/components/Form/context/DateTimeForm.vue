<script>
import PkpForm from '../Form.vue';
import moment from 'moment';

export default {
	name: 'DateTimeForm',
	extends: PkpForm,
	data() {
		return {
			// holds initial value of the field that emitted set event
			fieldBeforeSetEvent: {
				name: null,
				value: null
			},

			formatMap: new Map([
				// day
				['%a', 'ddd'],
				['%A', 'dddd'],
				['%d', 'DD'],
				['%e', 'D'],
				['%j', 'DDDD'],
				// week
				['%W', 'w'],
				['%V', 'W'],
				// month
				['%b', 'MMM'],
				['%B', 'MMMM'],
				['%m', 'MM'],
				// year
				['%y', 'YY'],
				['%Y', 'YYYY'],
				// time
				['%H', 'HH'],
				['%k', 'H'],
				['%I', 'hh'],
				['%l', 'h'],
				['%M', 'mm'],
				['%p', 'A'],
				['%P', 'a']
			])
		};
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
		fieldChanged: function(name, prop, value, localeKey) {
			// Update changed value
			let newFields = this.fields.map(field => {
				if (field.name === name) {
					this.fieldBeforeSetEvent.name = name;
					this.fieldBeforeSetEvent.value = field[prop][localeKey];
					field[prop][localeKey] = value;
				}

				return field;
			});

			if (
				!['dateFormatShort', 'dateFormatLong', 'timeFormat'].find(
					fieldName => fieldName === name
				)
			) {
				this.$emit('set', this.id, {fields: newFields});
				return;
			}

			const shortDate = this.fields.find(
				field => field.name === 'dateFormatShort'
			);
			const longDate = this.fields.find(
				field => field.name === 'dateFormatLong'
			);
			const time = this.fields.find(field => field.name === 'timeFormat');

			// Determine value for the short and long date & time fields
			let shortDateTimeValue = {
				date: shortDate.value[localeKey],
				time: time.value[localeKey]
			};
			let longDateTimeValue = {
				date: longDate.value[localeKey],
				time: time.value[localeKey]
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
				option => option.value === shortDate.value[localeKey]
			);
			const longDateOption = longDate.options[localeKey].find(
				option => option.value === longDate.value[localeKey]
			);
			const timeOption = time.options[localeKey].find(
				option => option.value === time.value[localeKey]
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
				{value: longDateTimeValue, label: longDateTimeLabel}
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
		updateFields: function(
			newFields,
			name,
			localeKey,
			shortDateTime,
			longDateTime
		) {
			return newFields.map(field => {
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

		/**
		 * Converts strftime datetime format to the Moment.js format
		 *
		 * @param {String} strftimeFormat
		 * @return {String|null}
		 */
		convertDateFormat: function(strftimeFormat) {
			let convertedLabel = '';
			const optArray = strftimeFormat.split('');
			for (let i = 0; i < optArray.length; i++) {
				const symbol = optArray[i];
				if (symbol === '%') {
					const nextSymbol = optArray[i + 1];
					const formatToCompare = symbol + nextSymbol;
					// map the format symbol
					if (this.formatMap.has(formatToCompare)) {
						convertedLabel += this.formatMap.get(formatToCompare);
						i++;
					} else if (nextSymbol === ' ') {
						// treat as punctuation
						convertedLabel += symbol;
					} else {
						// finally give-up, cannot convert
						return null;
					}
				} else {
					convertedLabel += symbol;
				}
			}
			// Not a format
			if (convertedLabel === strftimeFormat) return null;
			return convertedLabel;
		}
	},
	mounted() {
		this.$nextTick(function() {
			this.fields.forEach(field => {
				this.availableLocales.forEach(locale => {
					field.options[locale.key].forEach(option => {
						const formatString = this.convertDateFormat(option.label);
						if (formatString) {
							let dateTime = moment();
							dateTime.locale(locale.key);
							option.label = dateTime.format(formatString);
						}
					});
				});
			});
		});
	}
};
</script>
