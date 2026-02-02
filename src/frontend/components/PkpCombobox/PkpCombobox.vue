<template>
	<div :class="cn('root')">
		<ComboboxRoot
			v-model="selectedValue"
			:name="name"
			:filter-function="filterFunction"
			@update:model-value="handleSelect"
		>
			<ComboboxAnchor :class="cn('anchor')">
				<ComboboxInput
					:id="id"
					:class="cn('input')"
					:placeholder="placeholder"
					:display-value="(item) => item?.label ?? ''"
				/>
				<ComboboxTrigger :class="cn('trigger')">
					<PkpIcon icon="ChevronDown" :class="cn('triggerIcon')" />
				</ComboboxTrigger>
			</ComboboxAnchor>
			<ComboboxPortal>
				<ComboboxContent :class="cn('content')">
					<ComboboxViewport :class="cn('viewport')">
						<ComboboxEmpty :class="cn('empty')">
							{{ emptyMessage }}
						</ComboboxEmpty>
						<ComboboxItem
							v-for="item in items"
							:key="item.value"
							:value="item"
							:class="cn('item')"
						>
							<span :class="cn('itemLabel')">{{ item.label }}</span>
						</ComboboxItem>
					</ComboboxViewport>
				</ComboboxContent>
			</ComboboxPortal>
		</ComboboxRoot>
	</div>
</template>

<script setup>
import {ref} from 'vue';
import {
	ComboboxRoot,
	ComboboxAnchor,
	ComboboxInput,
	ComboboxTrigger,
	ComboboxPortal,
	ComboboxContent,
	ComboboxViewport,
	ComboboxEmpty,
	ComboboxItem,
} from 'reka-ui';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';

const props = defineProps({
	id: {
		type: String,
		default: null,
	},
	items: {
		type: Array,
		default: () => [],
	},
	placeholder: {
		type: String,
		default: '',
	},
	emptyMessage: {
		type: String,
		default: 'No results found',
	},
	name: {
		type: String,
		default: null,
	},
	styles: {
		type: Object,
		default: () => ({}),
	},
});

const emit = defineEmits(['select']);

const {cn} = usePkpStyles('PkpCombobox', props.styles);

const selectedValue = ref(null);

const filterFunction = (options, searchTerm) => {
	if (!searchTerm) return options;
	const term = searchTerm.toLowerCase();
	return options.filter((option) => option.label.toLowerCase().includes(term));
};

const handleSelect = (item) => {
	if (item) {
		emit('select', item);
	}
};
</script>
