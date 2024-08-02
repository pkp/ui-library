<template>
	<nav
		class="pkpPagination"
		role="navigation"
		:aria-label="t('common.pagination.label')"
	>
		<ul>
			<li>
				<PkpButton
					:disabled="currentPage === 1"
					:aria-label="
						t('common.pagination.goToPage', {
							page: t('common.pagination.previous'),
						})
					"
					:is-link="true"
					@click="setPage('previous')"
				>
					{{ t('common.pagination.previous') }}
				</PkpButton>
			</li>
			<li v-for="(item, index) in items" :key="index">
				<span
					v-if="item.isSeparator"
					class="pkpPagination__separator"
					:aria-hidden="true"
				>
					···
				</span>
				<Spinner
					v-else-if="isLoading && item.isCurrent"
					class="pkpPagination__loading"
				/>
				<PkpButton
					v-else
					:disabled="item.isDisabled"
					:aria-label="item.ariaLabel"
					:aria-current="item.isCurrent"
					class="pkpPagination__page"
					:is-link="true"
					@click="setPage(item.value)"
				>
					{{ item.label }}
				</PkpButton>
			</li>
			<li>
				<PkpButton
					:disabled="currentPage === lastPage"
					:is-link="true"
					@click="setPage('next')"
				>
					{{ t('common.pagination.next') }}
				</PkpButton>
			</li>
		</ul>
	</nav>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

export default {
	components: {PkpButton, Spinner},
	props: {
		/** The page that is currently being displayed. */
		currentPage: {
			type: Number,
			required: true,
		},
		/** Is the current page still loading? */
		isLoading: {
			type: Boolean,
			default: false,
		},
		/** The last page that is available. */
		lastPage: {
			type: Number,
			required: true,
		},
		/** showAdjacentPages */
		showAdjacentPages: {
			type: Number,
			default: 1,
		},
	},
	emits: [
		/** The page that should be selected. */
		'set-page',
	],
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
				this.lastPage,
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
					ariaLabel: this.getNumberAriaLabel(1),
				});
			}

			// Add a separator between the starting page and the inner pages
			if (innerMin > 2) {
				items.push({
					isSeparator: true,
				});
			}

			for (let i = innerMin; i <= innerMax; i++) {
				items.push({
					value: i,
					isCurrent: this.currentPage === i,
					label: i,
					ariaLabel: this.getNumberAriaLabel(i),
				});
			}

			// Add a separator between the last page and the inner pages
			if (innerMax < this.lastPage - 1) {
				items.push({
					isSeparator: true,
				});
			}

			// Add the last page
			if (innerMax < this.lastPage) {
				items.push({
					value: this.lastPage,
					label: this.lastPage,
					ariaLabel: this.getNumberAriaLabel(this.lastPage),
				});
			}

			return items;
		},
	},
	methods: {
		/**
		 * Get the label for a page link
		 *
		 * @param {Number} page
		 * @return {String}
		 */
		getNumberAriaLabel: function (page) {
			const pageLabel = this.t('common.pageNumber', {pageNumber: page});
			return this.t('common.pagination.goToPage', {page: pageLabel});
		},

		/**
		 * Emit an event to change the page
		 *
		 * @param {Number} page
		 */
		setPage: function (page) {
			if (page === 'previous') {
				page = this.currentPage - 1;
			} else if (page === 'next') {
				page = this.currentPage + 1;
			}
			if (page >= 1 && page <= this.lastPage) {
				this.$emit('set-page', page);
			}
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpPagination {
	display: flex;
	justify-content: flex-start;
	font-size: @font-tiny;
	line-height: 1.5em;
	text-align: center;

	ul {
		display: flex;
		align-items: center;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.pkpButton {
		padding-inline-start: 0.75rem;
		padding-inline-end: 0.75rem;
	}

	.pkpPagination__page {
		padding-inline-start: 0.5rem;
		padding-inline-end: 0.5rem;
		text-decoration: none;
		color: @text;
		font-weight: @normal;

		&[aria-current='true'] {
			font-weight: @bold;
		}
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

/**
 * Pagination components inside of a ListPanel footer
 */
.listPanel__footer .pkpPagination {
	justify-content: flex-end;
}
</style>
