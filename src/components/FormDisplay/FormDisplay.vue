<template>
	<component :is="containsForm ? 'form' : 'div'">
		<template v-for="group in groups" :key="group.id">
			<div
				class="flex border-b border-light border-opacity-50 p-8"
				:role="group.label && 'group'"
				:aria-labelledby="group.label && `${getGroupId(group)}_label`"
				:aria-describedby="
					group.description && `${getGroupId(group)}_description`
				"
			>
				<div v-if="group.label || group.groupComponent" class="w-[30%] pe-6">
					<template v-if="group.groupComponent">
						<component
							:is="group.groupComponent.component"
							:group-id="getGroupId(group)"
							v-bind="group.groupComponent.props"
						></component>
					</template>
					<FormGroupHeader
						v-else
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
		<ButtonRow
			v-if="containsForm"
			ref="footer"
			class="pkpFormPage__footer"
			:class="footerSpacingStyle"
			aria-live="polite"
		>
			<span role="status" aria-live="polite" aria-atomic="true">
				<transition name="pkpFormPage__status">
					<span v-if="isSaving" class="pkpFormPage__status">
						<Spinner />
						{{ t('common.saving') }}
					</span>
					<span v-else-if="hasRecentSave" class="pkpFormPage__status">
						<Icon icon="Complete" class="h-5 w-5 text-success" :inline="true" />
						{{ t('form.saved') }}
					</span>
				</transition>
			</span>
			<PkpButton
				v-if="cancelButton"
				v-bind="cancelButton"
				:is-warnable="true"
				@click="cancel"
			>
				{{ cancelButton.label || t('common.cancel') }}
			</PkpButton>
			<PkpButton
				v-if="submitButton"
				v-bind="submitButton"
				:disabled="isSaving || !canSubmit"
				@click="submit"
			>
				{{ submitButton.label }}
			</PkpButton>
		</ButtonRow>
	</component>
</template>

<script setup>
import {computed, useId} from 'vue';
import {shouldShowFieldWithinGroup} from '@/components/Form/formHelpers';

import PkpButton from '@/components/Button/Button.vue';
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import Icon from '@/components/Icon/Icon.vue';
import FormGroupHeader from '@/components/Form/FormGroupHeader.vue';
import FieldTextDisplay from './FieldTextDisplay.vue';
import FieldSelectDisplay from './FieldSelectDisplay.vue';
import FieldOptionsDisplay from './FieldOptionsDisplay.vue';

const uniqueId = useId();

const emit = defineEmits(['cancel', 'success']);

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
	containsForm: {type: Boolean, default: false},
	spacingVariant: {type: String, default: ''},
	pages: {type: Array, default: () => []},
	canSubmit: {type: Boolean, default: true},
	customSubmit: {type: Function, default: () => null},
	action: {type: String, default: ''},
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

const defaultPage = computed(() => {
	return props.pages?.find((page) => page.id === 'default') || {};
});

const cancelButton = computed(() => {
	return defaultPage.value.cancelButton;
});

const submitButton = computed(() => {
	return defaultPage.value.submitButton;
});

const footerSpacingStyle = computed(() => {
	if (props.spacingVariant === 'fullWidth') {
		return '!px-0 !py-12';
	}
	return '';
});

function cancel() {
	emit('cancel');
}

function submit() {
	if (props.customSubmit) {
		return props.customSubmit();
	}

	if (props.action === 'emit') {
		emit('success');
	}

	// TODO: Ajax call
}
</script>
