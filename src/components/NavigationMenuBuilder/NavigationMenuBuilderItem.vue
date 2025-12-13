<script setup>
import {ref, computed, watchEffect} from 'vue';
import {
	draggable,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {combine} from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
	attachInstruction,
	extractInstruction,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item';
import Icon from '@/components/Icon/Icon.vue';
import {MAX_DEPTH} from './navigationMenuUtils.js';
import {t} from '@/utils/i18n';

const props = defineProps({
	/** The menu item data */
	item: {
		type: Object,
		required: true,
	},
	/** Current nesting level (0 = root) */
	level: {
		type: Number,
		default: 0,
	},
	/** Whether this item has children */
	hasChildren: {
		type: Boolean,
		default: false,
	},
	/** Whether this is the last item in its parent's children array */
	isLastInGroup: {
		type: Boolean,
		default: false,
	},
	/** Whether this item is in the unassigned panel (no nesting allowed) */
	isUnassigned: {
		type: Boolean,
		default: false,
	},
	/** Indent size in pixels per level */
	indentPerLevel: {
		type: Number,
		default: 24,
	},
});

const emit = defineEmits([
	/** Emitted when the conditional warning button is clicked */
	'showConditionalWarning',
	/** Emitted when the submenu warning button is clicked */
	'showSubmenuWarning',
]);

const elRef = ref(null);
const isDragging = ref(false);
const instruction = ref(null);

// Compute the mode for pragmatic-drag-and-drop hitbox
const mode = computed(() => {
	if (props.isUnassigned) {
		// Unassigned items are always 'standard' - no nesting
		return 'standard';
	}
	if (props.hasChildren) {
		return 'expanded';
	}
	if (props.isLastInGroup) {
		return 'last-in-group';
	}
	return 'standard';
});

// Determine which instructions to block based on depth constraints
const blockedInstructions = computed(() => {
	const blocked = [];
	if (props.isUnassigned) {
		// In unassigned panel, block all nesting
		blocked.push('make-child');
		blocked.push('reparent');
	} else if (props.level >= MAX_DEPTH) {
		// At max depth, can't nest further
		blocked.push('make-child');
	}
	return blocked;
});

// Set up drag and drop
watchEffect((onCleanup) => {
	const element = elRef.value;
	if (!element) return;

	const itemData = {
		id: props.item.id,
		title: props.item.title,
		type: props.item.type,
		level: props.level,
		isUnassigned: props.isUnassigned,
	};

	const cleanup = combine(
		draggable({
			element,
			getInitialData: () => itemData,
			onDragStart: () => {
				isDragging.value = true;
			},
			onDrop: () => {
				isDragging.value = false;
			},
		}),

		dropTargetForElements({
			element,
			getData: ({input, element: el}) => {
				const data = {id: props.item.id};

				return attachInstruction(data, {
					input,
					element: el,
					indentPerLevel: props.indentPerLevel,
					currentLevel: props.level,
					mode: mode.value,
					block: blockedInstructions.value,
				});
			},
			canDrop: ({source}) => {
				// Can't drop on itself
				return source.data.id !== props.item.id;
			},
			onDrag: ({self}) => {
				const extracted = extractInstruction(self.data);
				instruction.value = extracted;
			},
			onDragEnter: () => {
				// Could expand item here if it has children
			},
			onDragLeave: () => {
				instruction.value = null;
			},
			onDrop: () => {
				instruction.value = null;
			},
			getIsSticky: () => true,
		}),
	);

	onCleanup(cleanup);
});

function handleConditionalWarningClick() {
	emit('showConditionalWarning', props.item);
}

function handleSubmenuWarningClick() {
	emit('showSubmenuWarning', props.item);
}
</script>

<template>
	<div
		ref="elRef"
		class="navigationMenuBuilderItem"
		:class="{
			'navigationMenuBuilderItem--dragging': isDragging,
			'navigationMenuBuilderItem--unassigned': isUnassigned,
			'navigationMenuBuilderItem--dropTarget':
				instruction?.type === 'make-child',
		}"
		:style="{marginInlineStart: `${level * indentPerLevel}px`}"
	>
		<!-- Drag handle -->
		<span class="navigationMenuBuilderItem__dragHandle" aria-hidden="true">
			<Icon icon="MoveUpDown" class="h-4 w-4" />
		</span>

		<!-- Title -->
		<span class="navigationMenuBuilderItem__title">
			{{ item.title }}
		</span>

		<!-- Action buttons -->
		<span class="navigationMenuBuilderItem__actions">
			<!-- Submenu warning (shown when item has children) -->
			<button
				v-if="hasChildren && !isUnassigned"
				type="button"
				class="navigationMenuBuilderItem__warningButton"
				@click.prevent="handleSubmenuWarningClick"
			>
				<Icon icon="TriangleAlert" class="h-4 w-4" />
				<span class="-screenReader">
					{{ t('manager.navigationMenus.form.submenuWarning') }}
				</span>
			</button>

			<!-- Conditional display warning -->
			<button
				v-if="item.conditionalWarning"
				type="button"
				class="navigationMenuBuilderItem__conditionalButton"
				@click.prevent="handleConditionalWarningClick"
			>
				<Icon icon="EyeOff" class="h-4 w-4" />
				<span class="-screenReader">
					{{ t('manager.navigationMenus.form.conditionalDisplay') }}
				</span>
			</button>
		</span>

		<!-- Drop indicator line (above/below) -->
		<div
			v-if="
				instruction &&
				(instruction.type === 'reorder-above' ||
					instruction.type === 'reorder-below')
			"
			class="navigationMenuBuilderItem__dropLine"
			:class="{
				'navigationMenuBuilderItem__dropLine--above':
					instruction.type === 'reorder-above',
				'navigationMenuBuilderItem__dropLine--below':
					instruction.type === 'reorder-below',
			}"
			:style="{
				insetInlineStart: `${((instruction.currentLevel || 0) - level) * indentPerLevel}px`,
			}"
		/>

		<!-- Make child indicator (highlight + badge) -->
		<div
			v-if="instruction?.type === 'make-child'"
			class="navigationMenuBuilderItem__nestIndicator"
		>
			<span class="navigationMenuBuilderItem__nestBadge">
				<span class="navigationMenuBuilderItem__nestArrow">↳</span>
				Add as child
			</span>
		</div>
	</div>
</template>

<style lang="less">
@import '../../styles/_import';

@drop-color: #2563eb; // Bright blue for maximum visibility

.navigationMenuBuilderItem {
	position: relative;
	display: flex;
	align-items: center;
	min-height: 44px;
	padding-block: 0.5rem;
	padding-inline-start: 0.75rem;
	padding-inline-end: 0.75rem;
	background: @lift;
	border: 1px solid @bg-border-color;
	border-radius: @radius;
	margin-block-end: 0.5rem;
	cursor: grab;
	user-select: none;
	transition:
		opacity 0.15s ease,
		box-shadow 0.15s ease,
		border-color 0.15s ease,
		background-color 0.15s ease;

	&:hover {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	&:focus-within {
		outline: 2px solid @primary;
		outline-offset: 2px;
	}
}

.navigationMenuBuilderItem--dragging {
	opacity: 0.4;
	cursor: grabbing;
	border-style: dashed;
}

.navigationMenuBuilderItem--unassigned {
	border-color: @bg-border-color-light;
	color: @text-light;

	.navigationMenuBuilderItem__dragHandle {
		color: @text-light;
	}
}

// When this item is a drop target for nesting
.navigationMenuBuilderItem--dropTarget {
	border-color: @drop-color;
	border-width: 2px;
	background: fade(@drop-color, 8%);
	box-shadow: 0 0 0 3px fade(@drop-color, 20%);
}

.navigationMenuBuilderItem__dragHandle {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2rem;
	height: 100%;
	flex-shrink: 0;
	color: @text-light;
}

.navigationMenuBuilderItem__title {
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.navigationMenuBuilderItem__actions {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	flex-shrink: 0;
}

.navigationMenuBuilderItem__warningButton,
.navigationMenuBuilderItem__conditionalButton {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2rem;
	height: 2rem;
	padding: 0;
	border: none;
	background: transparent;
	border-radius: @radius;
	cursor: pointer;
	transition: background-color 0.15s ease;

	&:hover {
		background: @bg;
	}

	&:focus {
		outline: 2px solid @primary;
		outline-offset: 2px;
	}
}

.navigationMenuBuilderItem__warningButton {
	color: @offset;
}

.navigationMenuBuilderItem__conditionalButton {
	color: @primary;
}

// Drop line indicator (for above/below)
.navigationMenuBuilderItem__dropLine {
	position: absolute;
	inset-inline-end: 0;
	height: 4px;
	background: @drop-color;
	border-radius: 2px;
	pointer-events: none;
	z-index: 10;
}

.navigationMenuBuilderItem__dropLine--above {
	top: -4px;
}

.navigationMenuBuilderItem__dropLine--below {
	bottom: -4px;
}

// Nest indicator (when making child)
.navigationMenuBuilderItem__nestIndicator {
	position: absolute;
	top: 100%;
	inset-inline-start: 0;
	inset-inline-end: 0;
	padding-block-start: 0.25rem;
	padding-inline-start: inherit;
	pointer-events: none;
	z-index: 10;
}

.navigationMenuBuilderItem__nestBadge {
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	padding: 0.25rem 0.5rem;
	background: @drop-color;
	color: white;
	font-size: @font-tiny;
	font-weight: @bold;
	border-radius: @radius;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.navigationMenuBuilderItem__nestArrow {
	font-size: 1rem;
	line-height: 1;
}
</style>
