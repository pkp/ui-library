<template>
	<th
		scope="col"
		:aria-sort="props.allowsSorting ? tableContext.sortDirection : undefined"
		class="bg-light px-2 py-4 text-left text-base-normal uppercase text-light first:pl-3 last:pr-3"
	>
		<template v-if="props.allowsSorting">
			<button class="pkpTableHeader__sort" @click="tableContext.onSort(id)">
				<slot />
				<icon
					:icon="iconType"
					class="pkpTableHeader__sortIcon"
					:aria-hidden="true"
				/>
				<span class="-screenReader">
					{{ t('grid.action.sort') }}
				</span>
			</button>
		</template>
		<template v-else>
			<slot />
		</template>
	</th>
</template>

<script setup>
import {defineProps, inject, computed} from 'vue';
const props = defineProps({
	/** Unique column identifier */
	id: {type: String, required: true},
	/** Enable sorting for given column */
	allowsSorting: {type: Boolean, required: false, default: () => false},
});

const iconType = computed(() => {
	const options = {
		ascending: 'sort-asc',
		descending: 'sort-desc',
		none: 'sort',
	};
	if (
		tableContext.sortDescriptor.value?.column === props.id &&
		tableContext.sortDescriptor.value?.direction
	) {
		return options[tableContext.sortDescriptor.value?.direction];
	}
	return 'sort';
});

const tableContext = inject('tableContext');
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
	text-transform: uppercase;

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
