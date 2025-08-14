<template>
	<div>
		<template v-for="group in groups" :key="group.id">
			<div
				v-if="!group.hideOnDisplay"
				class="flex border-b border-light border-opacity-50 p-8"
				:role="group.label && 'group'"
				:aria-labelledby="group.label && `${getGroupId(group)}_label`"
				:aria-describedby="
					group.description && `${getGroupId(group)}_description`
				"
			>
				<div v-if="group.label || group.groupComponent" class="w-[30%] pe-6">
					<FormGroupHeader
						:group-id="getGroupId(group)"
						:label="group.label"
						:description="group.description"
					/>
				</div>
				<div
					class="flex flex-col gap-y-6"
					:class="group.label || group.groupComponent ? 'w-[70%] ps-6' : ''"
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
			</div>
		</template>
	</div>
</template>

<script setup>
import {computed, useId} from 'vue';
import {shouldShowFieldWithinGroup} from '@/components/Form/formHelpers';

import FormGroupHeader from '@/components/Form/FormGroupHeader.vue';
import FieldTextDisplay from './FieldTextDisplay.vue';
import FieldSelectDisplay from './FieldSelectDisplay.vue';
import FieldOptionsDisplay from './FieldOptionsDisplay.vue';

const uniqueId = useId();

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

	if (field.hideOnDisplay) {
		return false;
	}

	return shouldShowFieldWithinGroup(field, props.fields);
}

function getGroupId(group) {
	return `${group.id}_${uniqueId}`;
}
</script>
