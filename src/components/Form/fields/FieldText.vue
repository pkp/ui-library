<template>
	<div class="pkpFormField pkpFormField--text" :class="classes">
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
			<HelpButton
				v-if="isPrimaryLocale && helpTopic"
				:id="describedByHelpId"
				:topic="helpTopic"
				:section="helpSection"
				:label="t('help.help')"
			/>
		</div>
		<div
			v-if="isPrimaryLocale && description"
			:id="describedByDescriptionId"
			v-strip-unsafe-html="description"
			class="pkpFormField__description"
		/>
		<div class="pkpFormField__control" :class="controlClasses">
			<div class="pkpFormField__control_top">
				<input
					:id="controlId"
					ref="input"
					v-model="currentValue"
					class="pkpFormField__input pkpFormField--text__input"
					:type="inputType"
					:name="localizedName"
					:aria-describedby="describedByIds"
					:aria-invalid="errors && errors.length"
					:disabled="isDisabled"
					:required="isRequired"
					:style="inputStyles"
				/>
				<span
					v-if="prefix"
					ref="prefix"
					v-strip-unsafe-html="prefix"
					class="pkpFormField__inputPrefix"
					:style="prefixStyles"
					@click="setFocus"
				/>
				<MultilingualProgress
					v-if="isMultilingual && locales.length > 1"
					:id="multilingualProgressId"
					:count="multilingualFieldsCompleted"
					:total="locales.length"
				/>
				<PkpButton
					v-if="optIntoEdit && isDisabled"
					class="pkpFormField--text__optIntoEdit"
					@click="isDisabled = false"
				>
					{{ optIntoEditLabel }}
				</PkpButton>
			</div>
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
import FormFieldLabel from '@/components/Form/FormFieldLabel.vue';
import FieldError from '@/components/Form/FieldError.vue';
import PkpButton from '@/components/Button/Button.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import MultilingualProgress from '@/components/MultilingualProgress/MultilingualProgress.vue';

export default {
	name: 'FieldText',
	components: {
		FormFieldLabel,
		FieldError,
		PkpButton,
		Tooltip,
		HelpButton,
		MultilingualProgress,
	},
	extends: FieldBase,
	props: {
		/** The`type` attribute for the `<input>` field. See [available types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types). */
		inputType: {
			type: String,
			default: 'text',
		},
		/**  Disables the field and adds a button that the user must click before they can edit it. */
		optIntoEdit: {type: Boolean, default: false},
		/** The label for the button added by `optIntoEdit` */
		optIntoEditLabel: String,
		/** One of `small`, `normal` or `large`. Default: `normal`. */
		size: {
			default: 'normal',
			validator: function (value) {
				return ['small', 'normal', 'large'].indexOf(value) !== -1;
			},
		},
		/** An optional prefix to show before the user's input. For example, a prefix of `http://publisher.com/` is used for the journal `path` field.  */
		prefix: String,
		/** A boolean value make text field disable */
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			inputStyles: {},
			isDisabled: false,
			prefixStyles: {},
		};
	},
	computed: {
		/**
		 * Add classes to wrapper element based on configuration
		 *
		 * @return {Array}
		 */
		classes() {
			let classes = ['pkpFormField--size' + this.size];
			if (this.isRTL()) {
				classes.push('pkpFormField--text--rtl');
			}
			return classes;
		},

		/**
		 * Add classes to the input control
		 *
		 * @return {Array}
		 */
		controlClasses() {
			let classes = [];
			if (this.isMultilingual && this.locales.length > 1) {
				classes.push('pkpFormField__control--hasMultilingualIndicator');
			}
			if (this.prefix) {
				classes.push('pkpFormField__control--hasPrefix');
			}
			return classes;
		},
	},
	mounted() {
		/**
		 * Increase input padding to account for a prefix if one exists and truncate
		 * prefix if it takes up the whole input area.
		 *
		 * In at least one case, the prefix clientWidth changes shortly after mount.
		 * Unable to track down the source of this changing clientWidth, we instead
		 * wait a bit before calculating the prefix padding. The delay is
		 * generous to account for the possibility that the clientWidth update will
		 * take longer on slower machines.
		 */
		this.$nextTick(() => {
			setTimeout(() => {
				if (this.prefix) {
					this.inputStyles = {
						direction: 'ltr',
						'padding-inline-start':
							this.$refs.prefix.clientWidth +
							this.$refs.prefix.offsetLeft +
							'px',
					};
					this.$nextTick(() => {
						const prefixLength =
							this.$refs.prefix.clientWidth + this.$refs.prefix.offsetLeft;
						if (prefixLength > this.$refs.input.clientWidth - 20) {
							this.prefixStyles = {
								width:
									this.$refs.input.clientWidth -
									this.$refs.prefix.offsetLeft -
									80 +
									'px',
								display: 'block',
								'white-space': 'nowrap',
								'overflow-x': 'hidden',
								'text-overflow': 'ellipsis',
							};
							this.$nextTick(() => {
								this.inputStyles = {
									direction: 'ltr',
									'padding-inline-start':
										this.$refs.prefix.clientWidth +
										this.$refs.prefix.offsetLeft +
										'px',
								};
							});
						}
					});
				}
			}, 700);
		});

		// Set the field to disabled if optIntoEdit is passed
		if (this.optIntoEdit || this.disabled) {
			this.isDisabled = true;
		}
	},
	methods: {
		/**
		 * Set focus to the control input
		 */
		setFocus() {
			this.$refs.input.focus();
		},
		isRTL() {
			var direction = document.body.getAttribute('dir');
			return direction === 'rtl';
		},
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--text {
	position: relative;
}

.pkpFormField--text__input {
	width: 20em;
	display: inline-block;
}

.pkpFormField__control {
	position: relative;
}

.pkpFormField__inputPrefix {
	position: absolute;
	top: 0;
	left: 1rem;
	height: 2.5rem;
	line-height: 2.5rem;
	font-size: 0.9em;
	color: @text-light;
}

.pkpFormField__control--hasMultilingualIndicator {
	.pkpFormField--text__input {
		padding-inline-start: 3rem;
	}

	.pkpFormField__inputPrefix {
		left: 3rem;
	}
}

.pkpFormField--text .multilingualProgress {
	position: absolute;
	top: 0;
	left: 0;

	button {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 2.5rem;
		height: 2.5rem;
		border: 1px solid transparent;
		border-inline-end: @bg-border;

		&:focus {
			outline: 0;
			border-color: @primary;
			box-shadow: inset 0 -3px 0 @primary;

			.fa {
				color: @primary;
			}
		}
	}

	.fa {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
}

.pkpFormField--text__input:hover + .multilingualProgress button {
	border-color: @shade;
}

.pkpFormField--text__input:focus + .multilingualProgress button {
	border-color: @primary;
}

.pkpFormField--text__optIntoEdit {
	margin-inline-start: 0.25rem;
	height: 2.5rem; // Match input height
}

.pkpFormField--sizesmall {
	.pkpFormField--text__input {
		width: 10em;
	}
}

.pkpFormField--sizelarge {
	.pkpFormField--text__input {
		width: 100%;
	}

	.pkpFormField--text__optIntoEdit {
		margin-inline-start: 0;
		margin-top: 0.25rem;
		height: inherit;
	}
}

[dir='rtl'] {
	.pkpFormField--text .multilingualProgress {
		left: auto;
		right: 0;

		button {
			left: auto;
			right: 0;
		}
	}

	.pkpFormField__control--hasMultilingualIndicator {
		.pkpFormField__inputPrefix {
			right: 3rem;
		}
	}
}
</style>
