<template>
	<nav
		class="pkpPagination"
		role="navigation"
		:aria-label="i18n.paginationLabel"
	>
		<ul>
			<li v-for="(item, index) in items" :key="index">
				<span
					v-if="item.isSeparator"
					class="pkpPagination__separator"
					:aria-hidden="true"
				>
					···
				</span>
				<pkp-button
					v-else
					:disabled="item.isDisabled"
					:aria-label="item.ariaLabel"
					:aria-current="item.isCurrent"
					:label="item.label"
					:isLink="!item.isCurrent && !['previous', 'next'].includes(item.value)"
					:isActive="item.isCurrent"
					@click="setPage(item.value)"
				/>
			</li>
		</ul>
	</nav>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';

export default {
	components: {
		PkpButton,
	},
	props: {
		currentPage: {
			type: Number,
			required: true,
		},
		lastPage: {
			type: Number,
			required: true,
		},
		innerPagesCount: {
			type: Number,
			default: 3,
		},
		i18n: Object,
	},
	computed: {
		/**
		 * Compile the items to display in the pagination component.
		 *
		 * Determines the page numbers to display, adds prev/next links, and adds
		 * separators where necessary
		 *
		 * @return Array
		 */
		items: function () {
			let items = [];
			const innerPadding = Math.floor(this.innerPagesCount / 2);
			let innerMax = Math.min(this.currentPage + innerPadding, this.lastPage);
			let innerMin = Math.max(this.currentPage - innerPadding, 1);

			// Add a Previous button
			items.push({
				value: 'previous',
				isDisabled: this.currentPage === 1,
				label: this.i18n.previousPageLabel,
				ariaLabel: this.__('goToLabel', { page: this.i18n.previousPageLabel }),
			});

			// Ensure there are always enough inner links
			// If the current page is at the start or end, expand the min/max
			if (innerMax - innerMin < this.innerPagesCount) {
				const remainder = this.innerPagesCount - (innerMax - innerMin);
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

			// Add a Next button
			items.push({
				value: 'next',
				isDisabled: this.currentPage === this.lastPage,
				label: this.i18n.nextPageLabel,
				ariaLabel: this.__('goToLabel', { page: this.i18n.nextPageLabel }),
			});

			return items;
		},
	},
	methods: {
		/**
		 * Get the label for a page link
		 *
		 * @param Number page
		 * @return String
		 */
		getNumberAriaLabel: function (page) {
			const pageLabel = this.__('pageLabel', { page: page });
			return this.__('goToLabel', { page: pageLabel });
		},

		/**
		 * Emit an event to change the page
		 *
		 * @param Number page
		 */
		setPage: function (page) {
			if (page === 'previous') {
				page = this.currentPage - 1;
			} else if (page === 'next') {
				page = this.currentPage + 1;
			}
			if (page >= 1 && page <= this.lastPage) {
				this.$emit('setPage', page);
			}
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpPagination {
	font-size: @font-tiny;
	line-height: 1.5em;

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
		text-align: center;
	}

	li {
		display: inline-block;
		margin-left: 0.25rem;
		margin-right: 0.25rem;

		&:first-child {
			float: left;
		}

		&:last-child {
			float: right;
		}
	}
}

.pkpPagination__separator {
	font-size: @font-tiny;
	color: @text-light;
	letter-spacing: 2px;
}
</style>
