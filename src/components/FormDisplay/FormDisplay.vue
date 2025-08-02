<template>
	<div>
		<div v-for="group in groups" :key="group.id">
			<fieldset class="flex border-b border-light border-opacity-50 p-8">
				<div v-if="shouldDisplayGroupHeader" class="w-[30%] pe-6">
					<FormGroupHeader
						:heading="group.label"
						:description="group.description"
					/>
				</div>
				<div
					class="flex flex-col gap-y-6 ps-6"
					:class="shouldDisplayGroupHeader ? 'w-[70%]' : ''"
				>
					<div v-if="hasMultilingualFields" class="flex flex-col gap-y-6">
						<div v-for="locale in availableLocales" :key="locale.key">
							<component
								:is="localeHeadingElement"
								class="mb-1 text-2xl-bold text-heading"
							>
								{{ locale.label }}
							</component>
							<div class="flex flex-col gap-y-6">
								<template
									v-for="field in groupFields[group.id]"
									:key="field.name"
								>
									<div v-if="shouldDisplayField(field)">
										<component
											:is="
												FieldComponents[field.component] ||
												field.component ||
												`${field.component}-display`
											"
											:field="field"
											:heading-element="fieldHeadingElement"
											:display-locale="field.isMultilingual ? locale.key : ''"
										></component>
									</div>
								</template>
							</div>
						</div>
					</div>
					<template
						v-for="field in groupFields[group.id]"
						v-else
						:key="field.name"
					>
						<div v-if="shouldDisplayField(field)">
							<component
								:is="
									FieldComponents[field.component] ||
									field.component ||
									`${field.component}-display`
								"
								:field="field"
								v-bind="field.componentProps"
								:heading-element="fieldHeadingElement"
							></component>
						</div>
					</template>
				</div>
			</fieldset>
		</div>
	</div>
</template>

<script setup>
import {computed} from 'vue';
import {shouldShowFieldWithinGroup} from '@/components/Form/formHelpers';

import FormGroupHeader from '@/components/Form/FormGroupHeader.vue';
import FieldTextDisplay from './FieldTextDisplay.vue';
import FieldSelectDisplay from './FieldSelectDisplay.vue';
import FieldOptionsDisplay from './FieldOptionsDisplay.vue';

const FieldComponents = {
	'field-text': FieldTextDisplay,
	'field-select': FieldSelectDisplay,
	'field-options': FieldOptionsDisplay,
};

const props = defineProps({
	fields: {type: Array, required: true},
	groups: {type: Array, default: () => [{id: 'default'}]},
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

// if the group header should be displayed
const shouldDisplayGroupHeader = computed(() => {
	return props.groups.length > 1 && props.groups[0]?.label;
});

// get all the fields for each groups
const groupFields = computed(() => {
	const eachGroupFields = {};
	props.fields.forEach((field) => {
		eachGroupFields[field.groupId] = eachGroupFields[field.groupId] || [];
		eachGroupFields[field.groupId].push(field);
	});

	return eachGroupFields;
});

// if the field should be displayed
function shouldDisplayField(field) {
	if (field.inputType === 'hidden') {
		return false;
	}

	if (field.hideWhenReadOnly) {
		return false;
	}

	return shouldShowFieldWithinGroup(field, props.fields);
}
</script>
