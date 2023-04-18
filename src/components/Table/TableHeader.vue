<template>
	<th
		scope="col"
		:aria-sort="canSort ? sortDirection : false"
		class="pkpTableHeader"
	>
		<template v-if="canSort">
			<button class="pkpTableHeader__sort" @click="$emit('table:sort')">
				<slot />
				<icon
					:icon="icon"
					class="pkpTableHeader__sortIcon"
					:aria-hidden="true"
				/>
				<span class="-screenReader">
					{{ __('grid.action.sort') }}
				</span>
			</button>
		</template>
		<template v-else>
			<slot />
		</template>
	</th>
</template>

<script>
export default {
	props: {
		canSort: {
			type: Boolean,
			default() {
				return false;
			},
		},
		sortDirection: {
			type: String,
			default() {
				return 'none';
			},
			validator(value) {
				return ['ascending', 'descending', 'none', 'other'].includes(value);
			},
		},
	},
	computed: {
		/**
		 * The icon to use with the sortDirection
		 */
		icon() {
			return (
				{
					ascending: 'sort-asc',
					descending: 'sort-desc',
				}[this.sortDirection] ?? 'sort'
			);
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpTableHeader__sort {
	position: relative;
	display: flex;
	align-items: center;
	gap: 0.5em;
	text-align: start;
	background: none;
	border: none;
	border-radius: 0;
	font-weight: inherit;

	&:focus-visible {
		outline: 1px solid @primary;
	}
}

.pkpTableHeader__sortIcon {
	color: @primary;
}

.pkpTableHeader[aria-sort]:not([aria-sort='none']) {
	background: @primary;
	color: @lift;

	.pkpTableHeader__sort {
		color: @lift;
	}

	.pkpTableHeader__sortIcon {
		color: @lift;
	}
}

// Expand button into th padding
.pkpTableHeader[aria-sort] {
	padding: 0;

	.pkpTableHeader__sort {
		padding: 0.5rem;
		width: 100%;
	}
}
</style>
