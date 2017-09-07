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
		 * This event emerges from a ListPanelItemOrderer component.
		 */
		itemOrderUp: function () {
			this.$emit('itemOrderUp', this.item);
		},

		/**
		 * Pass an itemOrderDown event up to the list panel
		 *
		 * This event emerges from a ListPanelItemOrderer component.
		 */
		itemOrderDown: function () {
			this.$emit('itemOrderDown', this.item);
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

.pkpListPanelItem__actions {

	a,
	button {
		display: inline-block;
		margin-top: 1em;
		margin-right: 2em;
		padding: 0;
		border: none;
		background: transparent;
		font-size: @font-tiny;
		font-weight: @bold;
		color: @primary;
		text-decoration: none;

		&:last-child {
			margin-right: 0;
		}
	}

	.delete {
		color: @no;
	}
}

.pkpListPanel.-isOrdering {

	.pkpListPanelItem {
		position: relative;
		padding-left: 5em;
		padding-right: 9em;
	}
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
