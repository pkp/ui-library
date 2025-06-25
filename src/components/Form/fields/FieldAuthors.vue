<template>
	<div
		:id="`${props.formId}-${props.name}`"
		class="pkpFormField pkpFormField--authors"
	>
		<div class="pkpFormField__heading">
			<label :id="labelId" class="pkpFormFieldLabel">
				{{ props.label }}
			</label>
		</div>
		<div :id="descriptionId" class="pkpFormField__description">
			{{ props.description }}
		</div>
		<PkpTable :labelled-by="labelId" :described-by="descriptionId">
			<TableHeader>
				<TableColumn id="">{{ t('user.givenName', []) }}</TableColumn>
				<TableColumn id="">{{ t('user.familyName', []) }}</TableColumn>
				<TableColumn id="">{{ t('user.orcid', []) }}</TableColumn>
				<TableColumn id="" class="w-[100px]">&nbsp;</TableColumn>
			</TableHeader>
			<TableBody>
				<TableRow v-for="(row, index) in currentValue" :key="index">
					<TableCell>
						<FieldText
							:name="'givenName'"
							:value="row.givenName"
							@change="
								(fieldName, _, fieldValue) => {
									updateRow(index, fieldName, fieldValue);
								}
							"
							:all-errors="{givenName: errors?.[index]?.givenName}"
						/>
					</TableCell>
					<TableCell>
						<FieldText
							:name="'familyName'"
							:value="row.familyName"
							@change="
								(fieldName, _, fieldValue) => {
									updateRow(index, fieldName, fieldValue);
								}
							"
							:all-errors="{familyName: errors?.[index]?.familyName}"
						/>
					</TableCell>
					<TableCell>
						<FieldText
							:name="'orcid'"
							:value="row.orcid"
							@change="
								(fieldName, _, fieldValue) => {
									updateRow(index, fieldName, fieldValue);
								}
							"
							:all-errors="{orcid: errors?.[index]?.orcid}"
						/>
					</TableCell>
					<TableCell>
						<PkpButton :is-link="true" @click="deleteRow(index)">
							{{ t('common.delete', []) }}
						</PkpButton>
					</TableCell>
				</TableRow>
			</TableBody>
			<template #bottom-controls>
				<PkpButton @click="addRow()">
					{{ addButtonLabel ? addButtonLabel : t('common.add') }}
				</PkpButton>
			</template>
		</PkpTable>
	</div>
</template>

<script setup>
import {computed, useId} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import PkpButton from '@/components/Button/Button.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableCell from '@/components/Table/TableCell.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';

const {t} = useLocalize();
const props = defineProps({
	/** Field key used for form submission */
	name: {
		type: String,
		default: null,
	},
	/** The ID of the form this field should appear in. This is passed down from the `Form`.  */
	formId: {
		type: String,
		default: null,
	},
	/** The `<label>` for this field. May be used in a `<fieldset>` when appropriate. All form fields should have an accessible label. */
	label: {
		type: String,
		default: null,
	},
	/** Adds a description to the field. Can include HTML code. */
	description: {
		type: String,
		default: null,
	},
	/** Current value of the field */
	value: {
		type: Array,
		default: () => [],
	},
	/** Label for add button */
	addButtonLabel: {
		type: String,
		default: null,
	},
	/** Object containing all form errors */
	allErrors: {
		type: Object,
		default() {
			return {};
		},
	},
});
const labelId = useId();
const descriptionId = useId();
const emit = defineEmits(['change', 'set-errors']);
const errors = computed(() => {
	if (!Object.keys(props.allErrors).includes(props.name)) {
		return [];
	}
	return props.allErrors[props.name];
});
const rowDataModel = () => {
	return {
		givenName: '',
		familyName: '',
		orcid: '',
	};
};
const currentValue = computed({
	get: () => props.value,
	set: (newVal) => emit('change', props.name, 'value', newVal),
});

function deleteRow(index) {
	currentValue.value.splice(index, 1);
}

function addRow() {
	currentValue.value.push(rowDataModel());
}

function updateRow(rowIndex, fieldName, fieldValue) {
	currentValue.value = currentValue.value.map((row, index) => {
		if (index !== rowIndex) {
			return row;
		}
		return {
			...row,
			[fieldName]: fieldValue,
		};
	});
}
</script>
