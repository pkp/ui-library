<template>
	<nav
		class="pkpPagination"
		role="navigation"
		:aria-label="__('common.pagination.label')"
	>
		<ul>
			<li>
				<pkp-button
					:disabled="currentPage === 1"
					:aria-label="
						__('common.pagination.goToPage', {
							page: __('common.pagination.previous')
						})
					"
					@click="setPage('previous')"
				>
					{{ __('common.pagination.previous') }}
				</pkp-button>
			</li>
			<li v-for="(item, index) in items" :key="index">
				<span
					v-if="item.isSeparator"
					class="pkpPagination__separator"
					:aria-hidden="true"
				>
					···
				</span>
				<spinner
					v-else-if="isLoading && item.isCurrent"
					class="pkpPagination__loading"
				/>
				<pkp-button
					v-else
					:disabled="item.isDisabled"
					:aria-label="item.ariaLabel"
					:aria-current="item.isCurrent"
					:is-link="
						!item.isCurrent && !['previous', 'next'].includes(item.value)
					"
					:is-active="item.isCurrent"
					@click="setPage(item.value)"
				>
					{{ item.label }}
				</pkp-button>
			</li>
			<li>
				<pkp-button
					:disabled="currentPage === lastPage"
					@click="setPage('next')"
				>
					{{ __('common.pagination.next') }}
				</pkp-button>
			</li>
		</ul>
	</nav>
</template>

<script>
export default {
	props: {
		currentPage: {
			type: Number,
			required: true
		},
		isLoading: {
			type: Boolean,
			default: false
		},
		lastPage: {
			type: Number,
			required: true
		},
		showAdjacentPages: {
			type: Number,
			default: 1
		}
	},
	computed: {
		/**
		 * Compile the items to display in the pagination component.
		 *
		 * Determines the page numbers to display, adds prev/next links, and adds
		 * separators where necessary
		 *
		 * @return {Array}
		 */
		items() {
			let items = [];
			let innerMax = Math.min(
				this.currentPage + this.showAdjacentPages,
				this.lastPage
			);
			let innerMin = Math.max(this.currentPage - this.showAdjacentPages, 1);

			// Ensure there are always enough inner links
			// If the current page is at the start or end, expand the min/max
			if (innerMax - innerMin < this.showAdjacentPages) {
				const remainder = this.showAdjacentPages - (innerMax - innerMin);
				if (innerMin === 1) {
					innerMax = Math.min(innerMax + remainder, this.lastPage);
				} else if (innerMax === this.lastPage) {
					innerMin = Math.max(innerMin - remainder, 1);
				}
			}

			// Add the starting page
			if (innerMin > 1) {
				items.push({
					value: 1,
					label: 1,
					ariaLabel: this.getNumberAriaLabel(1)
				});
			}

			// Add a separator between the starting page and the inner pages
			if (innerMin > 2) {
				items.push({
					isSeparator: true
				});
			}

			for (let i = innerMin; i <= innerMax; i++) {
				items.push({
					value: i,
					isCurrent: this.currentPage === i,
					label: i,
					ariaLabel: this.getNumberAriaLabel(i)
				});
			}

			// Add a separator between the last page and the inner pages
			if (innerMax < this.lastPage - 1) {
				items.push({
					isSeparator: true
				});
			}

			// Add the last page
			if (innerMax < this.lastPage) {
				items.push({
					value: this.lastPage,
					label: this.lastPage,
					ariaLabel: this.getNumberAriaLabel(this.lastPage)
				});
			}

			return items;
		}
	},
	methods: {
		/**
		 * Get the label for a page link
		 *
		 * @param {Number} page
		 * @return {String}
		 */
		getNumberAriaLabel: function(page) {
			const pageLabel = this.__('common.pageNumber', {pageNumber: page});
			return this.__('common.pagination.goToPage', {page: pageLabel});
		},

		/**
		 * Emit an event to change the page
		 *
		 * @param {Number} page
		 */
		setPage: function(page) {
			if (page === 'previous') {
				page = this.currentPage - 1;
			} else if (page === 'next') {
				page = this.currentPage + 1;
			}
			if (page >= 1 && page <= this.lastPage) {
				this.$emit('set-page', page);
			}
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpPagination {
	font-size: @font-tiny;
	line-height: 1.5em;
	text-align: center;

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: inline-block;
		margin-left: 1px;
		margin-right: 1px;

		&:first-child {
			float: left;
		}

		&:last-child {
			float: right;
		}
	}

	.pkpButton {
		padding-left: 0.75rem;
		padding-right: 0.75rem;
	}
}

.pkpPagination__separator {
	font-size: @font-tiny;
	color: @text-light;
	letter-spacing: 2px;
}

.pkpPagination__loading {
	display: inline-block;
	width: 34px;
}
</style>
