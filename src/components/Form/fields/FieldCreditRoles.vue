<template>
	<!-- To be able to scroll to this field on error-->
	<div
		:id="`${props.formId}-${props.name}`"
		class="pkpFormField pkpFormField--creditRoles"
	>
		<div class="pkpFormField__heading">
			<label :id="labelId" class="pkpFormFieldLabel">
				{{ t('submission.submit.creditRoles.title', {}) }}
			</label>
		</div>
		<div :id="descriptionId" class="pkpFormField__description">
			{{ t('submission.submit.creditRoles.description', {}) }}
		</div>
		<div class="pkpFormField__control pkpFormField--creditRoles__control">
			<PkpTable :labelled-by="labelId" :described-by="descriptionId">
				<TableHeader>
					<TableColumn id="">
						{{ t('submission.submit.creditRoles.role', {}) }}
					</TableColumn>
					<TableColumn id="">
						{{ t('submission.submit.creditRoles.degree', {}) }}
					</TableColumn>
					<TableColumn id="">&nbsp;</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow
						v-for="({role, degree}, creditRoleIndex) in currentValue"
						:key="creditRoleIndex"
					>
						<TableCell>
							<FieldSelect
								name="role"
								:label="t('submission.submit.creditRoles.selectRole')"
								:is-required="true"
								:value="role"
								:options="props.options.roles"
								class="creditRole__roleSelect"
								@change="
									(fieldName, propName, newValue, localeKey) =>
										updateCreditRole(creditRoleIndex, fieldName, newValue)
								"
							/>
						</TableCell>
						<TableCell>
							<FieldSelect
								name="degree"
								:label="t('submission.submit.creditRoles.selectDegree')"
								:value="degree"
								:options="props.options.degrees"
								class="creditRole__roleSelect"
								@change="
									(fieldName, propName, newValue, localeKey) =>
										updateCreditRole(creditRoleIndex, fieldName, newValue)
								"
							/>
						</TableCell>
						<TableCell>
							<PkpButton
								:is-warnable="true"
								@click="removeCreditRole(creditRoleIndex)"
							>
								{{ t('submission.submit.creditRoles.button.remove') }}
							</PkpButton>
						</TableCell>
					</TableRow>
				</TableBody>
				<template #bottom-controls>
					<PkpButton @click="addCreditRole()">
						{{ t('submission.submit.creditRoles.button.add') }}
					</PkpButton>
				</template>
			</PkpTable>
		</div>
	</div>
</template>

<script setup>
import {computed, useId} from 'vue';
import {t} from '@/utils/i18n';
import PkpButton from '@/components/Button/Button.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableCell from '@/components/Table/TableCell.vue';
import FieldSelect from './FieldSelect.vue';

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
	/** Current value of the field */
	value: {
		type: Array,
		default: () => [],
	},
	options: {
		type: Object,
		required: true,
	},
});

/**
 * Accessibility
 */
const labelId = useId();
const descriptionId = useId();

const emit = defineEmits(['change']);

const currentValue = computed({
	get: () => props.value,
	set: (newVal) => emit('change', props.name, 'value', newVal),
});

function addCreditRole() {
	currentValue.value.push({
		role: props.options.roles[0].value,
		degree: props.options.degrees[0].value,
	});
}

function removeCreditRole(index) {
	currentValue.value.splice(index, 1);
}

function updateCreditRole(index, fieldName, newValue) {
	currentValue.value[index][fieldName] = newValue;
}
</script>
