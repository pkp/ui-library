<template>
	<li class="pkpListPanelItem" :class="{'-hasFocus': isFocused}">
		{{ item.title }}
	</li>
</template>

<script>
export default {
	name: 'ListPanelItem',
	props: ['item'],
	data: function () {
		return {
			isFocused: false,
		};
	},
	computed: {
		/**
		 * Each item needs an id for list ordering to work. Most components
		 * should overwrite this computed property and map the item's id to
		 * this property.
		 */
		id: function () {
			return this.item.id || 0;
		},
	},
	methods: {

		/**
		 * Update the isFocused property
		 */
		focusItem: function () {
			this.isFocused = true;
		},

		/**
		 * Update the isFocused property
		 */
		blurItem: function () {
			this.isFocused = false;
		},

		/**
		 * Pass an itemOrderUp event up to the list panel
		 *
		 * This event emerges from an Orderer component.
		 */
		itemOrderUp: function () {
			this.$emit('itemOrderUp', this.item);
		},

		/**
		 * Pass an itemOrderDown event up to the list panel
		 *
		 * This event emerges from an Orderer component.
		 */
		itemOrderDown: function () {
			this.$emit('itemOrderDown', this.item);
		},

		/**
		 * Toggle the expanded or summary views
		 */
		toggleExpanded: function () {
			this.isExpanded = !this.isExpanded;
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpListPanelItem {
	position: relative;
	padding: 1em;
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

.pkpListPanel.-isOrdering {

	.pkpListPanelItem {
		position: relative;
		padding-left: 5em;
		padding-right: 9em;
	}
}

// ListPanels with a summary and detailed view
@expandedWidth: @base * 3;

.pkpListPanelItem--hasSummary {
	padding: 0;
}

.pkpListPanelItem__summary {
	position: relative;
	padding: 1em @expandedWidth 1em 1em;
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
				padding: 0.25em 0.5em;
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
