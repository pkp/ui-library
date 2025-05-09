<template>
	<div
		:id="`${props.formId}-${props.name}`"
		class="pkpFormField pkpFormField--citationAuthors"
	>
		<PkpTable aria-label="CitationAuthors">
			<TableHeader>
				<TableColumn id="">{{ t('user.givenName', []) }}</TableColumn>
				<TableColumn id="">{{ t('user.familyName', []) }}</TableColumn>
				<TableColumn id="">{{ t('user.orcid', []) }}</TableColumn>
				<TableColumn id="" class="w-[100px]">&nbsp;</TableColumn>
			</TableHeader>
			<TableBody>
				<TableRow
					v-for="(author, authorIndex) in currentValue"
					:key="authorIndex"
				>
					<TableCell>
						<FieldText :value="author.givenName" />
					</TableCell>
					<TableCell>
						<FieldText :value="author.givenName" />
					</TableCell>
					<TableCell>
						<FieldText v-if="!author.orcid" :value="author.orcid" />
						<a v-if="author.orcid" :href="author.orcid" target="_blank">
							<Icon
								icon="Orcid"
								:class="'relative top-[-2px] inline-block h-auto w-[16px] align-middle'"
								:inline="true"
							/>
							{{ author.orcid }}
						</a>
					</TableCell>
					<TableCell>
						{{ authorIndex }}
						<a
							class="pkpButton flex cursor-pointer items-center border-transparent py-2 text-lg-semibold text-primary hover:enabled:underline"
							@click="deleteAuthor(authorIndex)"
						>
							{{ t('common.delete', []) }}
						</a>
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>
						<Button @click="addAuthor()">
							{{ t('common.add') }}
						</Button>
					</TableCell>
					<TableCell></TableCell>
					<TableCell></TableCell>
					<TableCell></TableCell>
				</TableRow>
			</TableBody>
		</PkpTable>
	</div>
</template>

<script setup>
import Button from '@/components/Button/Button.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableCell from '@/components/Table/TableCell.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import {computed} from 'vue';
import {t} from '@/utils/i18n';
import FieldText from '@/components/Form/fields/FieldText.vue';
import Icon from '@/components/Icon/Icon.vue';

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
	/** Default locale of the form */
	primaryLocale: {
		type: String,
		default: 'en',
	},
	/** List of supported locales */
	locales: {
		type: Array,
		default: () => [],
	},
	/** Object containing all form errors */
	allErrors: {
		type: Object,
		default() {
			return {};
		},
	},
});
const authorDataModel = () => {
	return {
		displayName: '',
		givenName: '',
		familyName: '',
		orcid: '',
	};
};
const currentValue = computed({
	get: () => props.value,
	set: (newVal) => emit('change', props.name, 'value', newVal),
});

function deleteAuthor(authorIndex) {
	currentValue.value.splice(authorIndex, 1);
}

function addAuthor() {
	currentValue.value.push(authorDataModel());
}
</script>
