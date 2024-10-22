<template>
	<div>
		<div v-if="hasMultilingualFields">
			<div
				v-for="locale in availableLocales"
				:key="locale.key"
				class="mt-8 first:mt-0"
			>
				<component :is="localeHeadingElement" class="xl-bold mb-3 text-heading">
					{{ locale.label }}
				</component>
				<div class="flex flex-col gap-y-4">
					<div v-for="field in fields" :key="field.name">
						<component
							:is="
								FieldComponents[field.component] || `${field.component}-display`
							"
							:field="field"
							:heading-element="fieldHeadingElement"
							:display-locale="field.isMultilingual ? locale.key : ''"
						></component>
					</div>
				</div>
			</div>
		</div>
		<div
			v-for="field in fields"
			v-else
			:key="field.name"
			class="flex flex-col gap-y-10"
		>
			<component
				:is="FieldComponents[field.component] || `${field.component}-display`"
				:field="field"
				:heading-element="fieldHeadingElement"
			></component>
		</div>
	</div>
</template>

<script setup>
import {computed} from 'vue';
import FieldTextDisplay from './FieldTextDisplay.vue';
import FieldSelectDisplay from './FieldSelectDisplay.vue';

const FieldComponents = {
	'field-text': FieldTextDisplay,
	'field-select': FieldSelectDisplay,
};

const props = defineProps({
	fields: {type: Array, required: true},
	supportedFormLocales: {type: Array, required: true, default: () => []},
	localeHeadingElement: {required: false, default: 'h3', type: String},
	fieldHeadingElement: {required: false, default: 'h4', type: String},
});

const availableLocales = computed(() => {
	return hasMultilingualFields.value ? props.supportedFormLocales : [];
});

const hasMultilingualFields = computed(() => {
	return !!props.fields.find((field) => field.isMultilingual);
});
</script>
