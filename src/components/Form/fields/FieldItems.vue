<template>
	<div class="pkpFormField pkpFormField--items" :class="classes">
		<div class="pkpFormField__heading">
			<form-field-label
				:controlId="controlId"
				:label="label"
				:localeLabel="localeLabel"
				:isRequired="isRequired"
				:requiredLabel="__('common.required')"
				:multilingualLabel="multilingualLabel"
			/>
			<tooltip
				v-if="isPrimaryLocale && tooltip"
				aria-hidden="true"
				:tooltip="tooltip"
				label=""
			/>
			<span
				v-if="isPrimaryLocale && tooltip"
				class="-screenReader"
				:id="describedByTooltipId"
				v-html="tooltip"
			/>
			<help-button
				v-if="isPrimaryLocale && helpTopic"
				:id="describedByHelpId"
				:topic="helpTopic"
				:section="helpSection"
				:label="__('help.help')"
			/>
		</div>
		<div
			v-if="isPrimaryLocale && description"
			class="pkpFormField__description"
			v-html="description"
			:id="describedByDescriptionId"
		/>
		<div class="pkpFormField__control" :class="controlClasses">
			<div class="pkpFormField__control_top">
				<input
					type="hidden"
					ref="input"
					v-model="currentValue"
					:id="controlId"
					:name="localizedName"
					:aria-describedby="describedByIds"
					:aria-invalid="errors && errors.length"
					:disabled="isDisabled"
					:required="isRequired"
				/>
				<input
					class="pkpFormField__input pkpFormField--items__input"
					v-model="newItem"
					type="text"
					:style="inputStyles"
				/>
				<span
					v-if="prefix"
					class="pkpFormField__inputPrefix"
					v-html="prefix"
					ref="prefix"
					:style="prefixStyles"
					@click="setFocus"
				/>
				<multilingual-progress
					v-if="isMultilingual && locales.length > 1"
					:id="multilingualProgressId"
					:count="multilingualFieldsCompleted"
					:total="locales.length"
				/>
				<pkp-button class="pkpFormField--items__optIntoAdd" @click="addNewItem">
					{{ optIntoAddLabel }}
				</pkp-button>
				<ul v-for="(item, index) in currentValue" :key="index">
					<li>
						{{ item }}
						<pkp-button @click="removeItem(index)">X</pkp-button>
					</li>
				</ul>
			</div>
			<field-error
				v-if="errors && errors.length"
				:id="describedByErrorId"
				:messages="errors"
			/>
		</div>
	</div>
</template>

<script>
import FieldBase from './FieldBase.vue';

export default {
	name: 'FieldItems',
	extends: FieldBase,
	props: {
		inputType: String,
		optIntoEdit: Boolean,
		optIntoEditLabel: String,
		size: {
			default: 'normal',
			validator: function(value) {
				return ['small', 'normal', 'large'].indexOf(value) !== -1;
			}
		},
		prefix: String,
		optIntoAddLabel: String
	},
	data() {
		return {
			inputStyles: {},
			isDisabled: false,
			prefixStyles: {},
			newItem: ''
		};
	},
	computed: {
		/**
		 * Add classes to wrapper element based on configuration
		 *
		 * @return {Array}
		 */
		classes() {
			return ['pkpFormField--size' + this.size];
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
		}
	},
	methods: {
		/**
		 * Set focus to the control input
		 */
		setFocus() {
			this.$refs.input.focus();
		},
		/**
		 * Add a new item into list
		 */
		addNewItem() {
			this.currentValue.push(this.newItem);

			this.newItem = '';
		},
		/**
		 * Remove an item from list
		 */
		removeItem(idx) {
			if (!this.currentValue.hasOwnProperty(idx)) {
				return;
			}

			this.currentValue.splice(idx, 1);
		}
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
						'padding-left':
							this.$refs.prefix.clientWidth +
							this.$refs.prefix.offsetLeft +
							'px'
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
								'text-overflow': 'ellipsis'
							};
							this.$nextTick(() => {
								this.inputStyles = {
									'padding-left':
										this.$refs.prefix.clientWidth +
										this.$refs.prefix.offsetLeft +
										'px'
								};
							});
						}
					});
				}
			}, 700);
		});

		// Set the field to disabled if optIntoEdit is passed
		if (this.optIntoEdit) {
			this.isDisabled = true;
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.pkpFormField--items__input {
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
	.pkpFormField--items__input {
		padding-left: 3rem;
	}

	.pkpFormField__inputPrefix {
		left: 3rem;
	}
}

.pkpFormField--items .multilingualProgress {
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
		border-right: @bg-border;

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

.pkpFormField--items__input:hover + .multilingualProgress button {
	border-color: @shade;
}

.pkpFormField--items__input:focus + .multilingualProgress button {
	border-color: @primary;
}

.pkpFormField--items__optIntoAdd {
	margin-left: 0.25rem;
	height: 2.5rem; // Match input height
}

.pkpFormField--sizesmall {
	.pkpFormField--items__input {
		width: 10em;
	}
}

.pkpFormField--sizelarge {
	.pkpFormField--items__input {
		width: 100%;
	}

	.pkpFormField--items__optIntoAdd {
		margin-left: 0;
		margin-top: 0.25rem;
		height: inherit;
	}
}
</style>
