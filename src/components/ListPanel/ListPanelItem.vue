<template>
	<div :class="classes">
		<orderer
			v-if="canOrder && isOrdering"
			@up="orderUp"
			@down="orderDown"
			:itemId="item.id"
			:itemTitle="item.title"
			:i18n="i18n"
		/>
		<!-- Items with checkbox or radio selection -->
		<label v-if="canSelect" class="pkpListPanelItem__selectorLabel">
			<div class="pkpListPanelItem__selector">
				<input
					v-if="canSelect"
					:type="selectorType"
					:id="selectorId"
					:name="selectorName"
					:value="id"
					v-model="localSelected"
				/>
			</div>
			{{ item.title }}
		</label>
		<template v-else>
			{{ item.title }}
		</template>
	</div>
</template>

<script>
import Orderer from '@/components/Orderer/Orderer.vue';

export default {
	name: 'ListPanelItem',
	components: {
		Orderer
	},
	props: {
		canOrder: {
			type: Boolean,
			default() {
				return false;
			}
		},
		canSelect: {
			type: Boolean,
			default() {
				return false;
			}
		},
		i18n: {
			type: Object,
			default() {
				return {};
			}
		},
		isOrdering: {
			type: Boolean,
			default() {
				return false;
			}
		},
		selectorType: {
			type: String,
			default() {
				return 'checkbox';
			}
		},
		selectorName: {
			type: String,
			default() {
				return '';
			}
		},
		selected: {
			type: [Number, String, Array],
			default() {
				if (this.selectorType === 'radio') {
					return '';
				} else {
					return [];
				}
			}
		},
		item: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data: function() {
		return {
			isFocused: false
		};
	},
	computed: {
		/**
		 * Classes to apply to the root element
		 *
		 * @return Array
		 */
		classes() {
			let classes = ['pkpListPanelItem'];
			if (this.canOrder) {
				classes.push('-hasOrderer');
			}
			if (this.isOrdering) {
				classes.push('-isOrdering');
			}
			if (this.canSelect) {
				classes.push('-hasSelector');
			}
			return classes;
		},

		/**
		 * Each item needs an id for list ordering to work. Most components
		 * should overwrite this computed property and map the item's id to
		 * this property.
		 *
		 * @return Number
		 */
		id: function() {
			return this.item.id || 0;
		},

		/**
		 * A wrapper for the selected prop which emits an event to update
		 * the value when the selection changes
		 */
		localSelected: {
			get() {
				return this.selected;
			},
			set(newVal, oldVal) {
				this.$emit('update:selected', newVal);
			}
		},

		/**
		 * A unique ID for the input field
		 *
		 * @return String
		 */
		selectorId() {
			return `${this.selectorName}-${this.id}`;
		}
	},
	methods: {
		/**
		 * Emit an event to move this item up in the order
		 */
		orderUp: function() {
			this.$emit('order-up', this.item);
		},

		/**
		 * Emit an event to move this item down in the order
		 */
		orderDown: function() {
			this.$emit('order-down', this.item);
		},

		/**
		 * Toggle the expanded or summary views
		 */
		toggleExpanded: function() {
			this.isExpanded = !this.isExpanded;
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpListPanelItem {
	position: relative;
	padding: 1rem;
	border-bottom: @grid-border;
	font-size: @font-sml;
	line-height: 1.5em;
	list-style: none;

	// Use a box-shadow instead of a border so
	// it overlaps with the footer border
	&:last-child {
		border-bottom: none;
		box-shadow: 0 1px 0 @grid-border-color;
	}
}

.pkpListPanelItem.-hasSelector {
	padding: 0 0 0 3rem;

	.pkpListPanelItem__selectorLabel {
		display: block;
		padding: 1rem;
		// Override legacy form label styles
		font-size: @font-sml;
		font-weight: @normal;
	}
}

.pkpListPanelItem__selector {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	width: 3rem;
	border-right: @grid-border;

	input {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		&:focus {
			outline: @primary dotted 1px;
			outline-offset: 0.25rem;
		}
	}
}

.pkpListPanel.-isOrdering {
	.pkpListPanelItem {
		position: relative;
		padding-left: 4rem;
		padding-right: 7rem;
	}
}

// ListPanels with a summary and detailed view
@expandedWidth: 3rem;

// Move padding to the summary so expander border reaches edge
.-hasSummary {
	padding: 0;
}

.pkpListPanelItem__summary {
	position: relative;
	padding: 1rem @expandedWidth 1rem 1rem;
}

.pkpListPanelItem.-hasSummary.-hasSelector {
	padding: 0;

	// Move padding to the label to avoid gaps in clickable areas
	.pkpListPanelItem__summary {
		padding-top: 0;
		padding-bottom: 0;
		padding-left: 3rem;

		.pkpListPanelItem__selectorLabel {
			padding: 1rem 0 1rem 1rem;
		}
	}
}

.pkpListPanelItem__expander {
	position: absolute;
	top: 0;
	right: 0;
	width: @expandedWidth;
	height: 100%;
	background: transparent;
	border: none;
	border-left: @grid-border;
	text-align: center;
	cursor: pointer;

	.fa {
		font-size: 20px;
		font-weight: @bold;
		color: @primary;
	}

	&:hover,
	&:focus {
		background: @primary;
		outline: 0;

		.fa {
			color: #fff;
		}
	}
}

.pkpListPanelItem__details {
	padding: 1em;
	border-top: @grid-border;
}

.pkpListPanelItem__mask {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 0;
	height: 0;
	opacity: 0;
	border-radius: 50%;
	transform: translate(-50%, -50%);
	transition: all 0.3s;

	&.-active {
		width: 100%;
		height: 100%;
		opacity: 1;
		border-radius: 0;
		background: @bg-light;
	}

	&.-alert {
		background: @offset;

		.pkp_spinner:after {
			border-top-color: #fff;
			border-left-color: #fff;
			border-bottom-color: transparent;
			border-right-color: transparent;
		}

		.pkpListPanelItem__maskLabel {
			font-weight: @bold;
			color: #fff;

			a {
				margin-left: 1em;
				padding: 0.25rem 0.5em;
				background: #fff;
				border-radius: @radius;
				text-decoration: none;
				color: @offset;

				&:hover,
				&:focus {
					background: @offset-lift;
					color: #fff;
				}
			}
		}
	}

	&.-finish {
		background: #fff;
	}
}

.pkpListPanelItem__maskLabel {
	position: absolute;
	top: 50%;
	width: 100%;
	transform: translateY(-50%);
	text-align: center;

	.pkp_spinner {
		margin-right: 1em;
	}
}
</style>
