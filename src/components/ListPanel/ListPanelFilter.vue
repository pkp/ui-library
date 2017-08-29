<template>
	<div class="pkpListPanel__filter" :class="{'-isVisible': this.isVisible}">
		<div class="pkpListPanel__filterHeader" tabindex="0">
			<span class="fa fa-filter pkpIcon--inline" aria-hidden="true"></span>
			{{ i18n.filter }}
		</div>
		<div class="pkpListPanel__filterOptions"></div>
	</div>
</template>

<script>
export default {
	name: 'ListPanelFilter',
	props: ['i18n', 'isVisible'],
	data: function () {
		return {
			activeFilters: [],
		};
	},
	computed: {
		tabIndex: function () {
			return this.isVisible ? false : -1;
		},
	},
	methods: {
		/**
		 * Emit an event to filter items in the list panel
		 */
		filterList: function (data) {
			this.$emit('filterList', data);
		},

		/**
		 * Clear any filters that are currently active
		 */
		clearFilters: function () {
			this.activeFilters = [];
			this.filterList({});
		},
	},
	mounted: function () {
		/**
		 * Set focus in filters whenever the visible status is initiated
		 */
		this.$watch('isVisible', function (newVal, oldVal) {
			if (!newVal || newVal === oldVal) {
				return;
			}
			this.$el.querySelector('.pkpListPanel__filterHeader').focus();
		});
	},
};
</script>

<style lang="less">
@import '../../styles/_config';

.pkpListPanel__filter {
	position: absolute;
	left: -9999px;
	width: 0;
}

.pkpListPanel__filter:before {
	content: '';
	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	border-right: @grid-border;
}

.pkpListPanel__filter,
.pkpListPanel__content {
	transition: width 0.2s;
}

.pkpListPanel__content {
	position: relative;
}

.pkpListPanel__filter + .pkpListPanel__content {
	float: right;
	width: 100%;
}

.pkpListPanel__filterHeader {
	margin: @base 0;
	padding: 0 @base;
	font-size: @font-sml;
	line-height: @line-sml;
	font-weight: @bold;

	&:focus {
		outline: 0;
	}
}

.pkpListPanel__filterHeader,
.pkpListPanel__filterOptions {
	position: absolute;
	left: -9999px;
	opacity: 0;
	// This is an arbitrarily large width that is used to smooth the transition
	// when the filter panel is shown. Without a large width, the filter options
	// get squished as the parent element grows from a small to a large size.
	// This then causes the content to have additional line breaks, so that the
	// panel starts tall and shortens as the width expands. By forcing a big
	// width here, we prevent it from "jumping" to a large height.
	width: 1000px;
}

.pkpListPanel__filterSet {
	margin: @base 0;
	font-size: @font-sml;
	line-height: @line-sml;

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		position: relative;
	}
}

.pkpListPanel__filterSetLabel {
	padding-left: @base;
	padding-right: @base;
	font-weight: @bold;
	font-size: @font-tiny;
	color: @text-light;
}

.pkpListPanel__filterLabel {
	display: block;
	padding: (@half / 2) @base;
	background: transparent;
	border: none;
	color: @primary;
	text-decoration: none;

	&:focus {
		border-left: 2px solid @primary;
		padding-left: @base - 2;
		outline: 0;
	}

	&.-isActive {
		font-weight: @bold;
	}
}

.pkpListPanel__filterRemove {
	position: absolute;
	top: 50%;
	right: 0;
	padding: 0;
	margin: 0;
	width: @double;
	border: none;
	transform: translateY(-50%);
	background: transparent;
	text-align: center;
	color: @text-light;

	&:hover,
	&:focus {
		color: @offset;
	}
}
</style>
