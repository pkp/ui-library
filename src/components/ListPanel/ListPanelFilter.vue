<template>
	<div class="pkpListPanel__filter" :class="{'-isVisible': this.isVisible}">
		<div class="pkpListPanel__filterHeader" tabindex="0">
			<icon icon="filter" :inline="true" />
			{{ i18n.filter }}
		</div>
		<div class="pkpListPanel__filterOptions">
			<div v-for="(filter, filterType) in filters" class="pkpListPanel__filterSet">
				<div v-if="filter.heading" class="pkpListPanel__filterSetLabel">
					{{ filter.heading }}
				</div>
				<template v-if="filter.isAutoSuggest">
					<ul v-if="activeFilters[filterType]">
						<template v-for="filterItem in filter.filters">
							<li v-if="isFilterActive(filterItem.param, filterItem.val)" :key="filterItem.param + filterItem.val">
								<button
									@click.prevent.stop="filterBy(filterItem.param, filterItem.val)"
									class="pkpListPanel__filterLabel -isActive"
									:tabindex="tabIndex"
								>
									{{ filterItem.title }}
								</button>
								<button
									class="pkpListPanel__filterRemove"
									@click.prevent.stop="clearFilter(filterItem.param, filterItem.val)"
								>
									<icon icon="times-circle-o" />
									<span class="-screenReader">{{ __('filterRemove', {filterTitle: filterItem.title}) }}</span>
								</button>
							</li>
						</template>
					</ul>
					<list-panel-filter-auto-suggest
						@select="autoSuggestFilterSelected"
						:name="filterType"
						:options="filter.filters"
						:selected="activeFilters[filterType]"
						:placeholder="i18n.search"
					/>
				</template>
				<template v-else>
					<ul>
						<li v-for="filterItem in filter.filters" :key="filterItem.param + filterItem.val">
							<button
								@click.prevent.stop="filterBy(filterItem.param, filterItem.val)"
								class="pkpListPanel__filterLabel"
								:class="{'-isActive': isFilterActive(filterItem.param, filterItem.val)}"
								:tabindex="tabIndex"
							>
								{{ filterItem.title }}
							</button>
							<button
								v-if="isFilterActive(filterItem.param, filterItem.val)"
								class="pkpListPanel__filterRemove"
								@click.prevent.stop="clearFilter(filterItem.param, filterItem.val)"
							>
								<icon icon="times-circle-o" />
								<span class="-screenReader">{{ __('filterRemove', {filterTitle: filterItem.title}) }}</span>
							</button>
						</li>
					</ul>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';
import ListPanelFilterAutoSuggest from '@/components/ListPanel/ListPanelFilterAutoSuggest.vue';

export default {
	name: 'ListPanelFilter',
	components: {
		Icon,
		ListPanelFilterAutoSuggest,
	},
	props: {
		i18n: {
			type: Object,
			required: true,
		},
		filters: {
			type: Object,
			required: true,
		},
		activeFilters: {
			type: Object,
			required: true,
		},
		isVisible: {
			type: Boolean,
			required: true,
		},
	},
	computed: {
		/**
		 * Update the tab index so users don't have to tab through filters when
		 * they're not visible
		 *
		 * @return boolean|integer
		 */
		tabIndex: function () {
			return this.isVisible ? false : -1;
		},
	},
	methods: {
		/**
		 * Check if filter is active
		 *
		 * @param string type The type of filter to check for
		 * @param mixed val The value to check for
		 */
		isFilterActive: function (type, val) {
			if (typeof this.activeFilters[type] === 'undefined') {
				return false;
			}
			if (typeof this.activeFilters[type] === 'string' && this.activeFilters[type] === val) {
				return true;
			}
			if (Array.isArray(this.activeFilters[type]) && this.activeFilters[type].includes(val)) {
				return true;
			}
			return false;
		},

		/**
		 * Add a filter
		 */
		filterBy: function (type, val) {
			if (this.isFilterActive(type, val)) {
				this.clearFilter(type, val);
			} else {
				let filters = Object.assign({}, this.activeFilters);
				if (filters[type] === undefined) {
					filters[type] = [];
				}
				filters[type].push(val);
				this.filterList(filters);
			}
		},

		/**
		 * Remove a filter
		 */
		clearFilter: function (type, val) {
			const filters = Object.assign({}, this.activeFilters);
			if (Array.isArray(filters[type])) {
				filters[type] = this.activeFilters[type].filter((filterVal) => {
					return filterVal !== val;
				});
			} else {
				delete filters[type];
			}
			this.filterList(filters);
		},

		/**
		 * Clear any filters that are currently active
		 */
		clearFilters: function () {
			this.filterList({});
		},

		/**
		 * Emit an event to update the active filters in the list panel
		 */
		filterList: function (data) {
			this.$emit('filterList', data);
		},

		autoSuggestFilterSelected: function (data) {
			let filters = Object.assign({}, this.activeFilters);
			let filterType = data.name;
			if (!filters[filterType]) {
				filters[filterType] = [];
			}
			if (filters[filterType].indexOf(data.value.item.val) > -1) {
				return;
			}
			filters[filterType].push(data.value.item.val);
			this.$emit('filterList', filters);
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
@import '../../styles/_import';

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

.pkpListPanel__filter.-isVisible {
	float: left;
	position: relative;
	left: auto;
	width: 25%;

	+ .pkpListPanel__content  {
		float: right;
		width: 75%;

		&:before {
			content: '';
			position: absolute;
			top: 0;
			bottom: 0;
			right: 0;
			left: -1px;
			border-left: @grid-border;
		}
	}

	.pkpListPanel__filterHeader,
	.pkpListPanel__filterOptions {
		position: relative;
		left: 0;
		opacity: 1;
		width: 100%;
		transition: opacity 0.2s ease-in-out 0.2s, left 0s ease-in-out 0.2s, width 0s ease-in-out 0.2s;
	}
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
	position: relative;
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

.pkpListPanel__filterSet .autosuggest {
	margin-top: 0.5rem;
	padding-left: @base;
	padding-right: @base;
}

.pkpListPanel__filterLabel {
	display: block;
	padding: (@half / 2) @base;
	background: transparent;
	border: none;
	color: @primary;
	line-height: @line-base;
	text-align: left; // Override center alignment of two-line <buttons>
	text-decoration: none;
	cursor: pointer;

	&:focus {
		border-left: 2px solid @primary;
		padding-left: @base - 2;
		outline: 0;
	}

	&.-isActive {
		font-weight: @bold;
	}
}

.pkpListPanel__filterInputLabel {
	display: block;
	padding: 0 @base;
}

.pkpListPanel__filterInput {
	padding: (@half / 2) @base;
}

.pkpListPanel__filterAdd,
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
	font-size: @font-base;
	text-align: center;
	color: @text-light;
	cursor: pointer;
}

.pkpListPanel__filterAdd {

	&:hover,
	&:focus {
		color: @primary;
	}
}

.pkpListPanel__filterRemove {
	color: @offset;

	&:hover,
	&:focus {
		color: @offset;
	}
}
</style>
