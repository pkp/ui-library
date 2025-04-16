<template>
	<div
		v-if="$parent.fields[1].value"
		:id="`${props.formId}-${props.name}`"
		class="pkpFormField pkpFormField--citations"
	>
		<!-- <textarea style="width: 100%; height: 300px; border: 1px solid #000;">{{ $parent }}</textarea> -->
		<!-- <textarea style="width: 100%; height: 300px; border: 1px solid #000;">{{ props }}</textarea> -->
		<!-- <textarea style="width: 100%; height: 300px; border: 1px solid #000;">{{ $.pkp }}</textarea> -->
		<div class="pkpFormField__control pkpFormField--citations__control">
			<div
				v-if="props.description"
				v-strip-unsafe-html="props.description"
				class="pkpFormField__description"
			/>
			<div class="py-4">
				<PkpTable aria-label="Citations">
					<TableRow>
						<TableCell> &nbsp; </TableCell>
						<TableCell colspan="2">
							<Search
								:search-phrase="searchPhrase"
								@search-phrase-changed="(newVal) => (searchPhrase = newVal)"
							/>
						</TableCell>
					</TableRow>
					<TableHeader>
						<TableColumn id="">Parsed Citations</TableColumn>
						<TableColumn id="" class="w-[100px]">Edit Citation</TableColumn>
						<TableColumn id="" class="w-[100px]">
							<a
								@click="toggleAllExpanded()"
								v-if="!allExpanded"
								class="cursor-pointer"
							>
								{{ t('submission.citations.structured.expandAll', []) }}
							</a>
							<a
								@click="toggleAllExpanded()"
								v-if="allExpanded"
								class="cursor-pointer"
							>
								{{ t('submission.citations.structured.collapseAll', []) }}
							</a>
						</TableColumn>
					</TableHeader>
					<TableBody>
						<TableRow
							v-for="(citation, citationIndex) in currentValue"
							:key="citationIndex"
						>
							<TableCell>
								<div>
									<div class="text-lg-normal">
										<a
											v-if="citation.doi"
											class="text-lg-normal"
											:href="citation.doi"
											target="_blank"
										>
											{{ citation.doi.replace('https://doi.org/', '') }}
										</a>
										<a
											v-if="citation.url"
											class="text-lg-normal"
											:href="citation.url"
											target="_blank"
										>
											{{ citation.url }}
										</a>
										<a
											v-if="citation.arxiv"
											class="text-lg-normal"
											:href="citation.arxiv"
											target="_blank"
										>
											{{ citation.arxiv }}
										</a>
										<a
											v-if="citation.handle"
											class="text-lg-normal"
											:href="citation.handle"
											target="_blank"
										>
											{{ citation.handle }}
										</a>
										<span v-if="citation.urn">urn: {{ citation.urn }}</span>
									</div>
									<div>{{ citation.title }}</div>
									<div
										v-if="
											!citation.doi &&
											!citation.url &&
											!citation.urn &&
											!citation.arxiv &&
											!citation.handle &&
											!citation.title
										"
									>
										{{ citation.rawCitation }}
									</div>
								</div>
								<div v-if="citation.isExpanded || allExpanded">
									<div>
										<span v-for="(author, authorIndex) in citation.authors">
											<span class="text-lg-normal">
												{{ author.familyName }} {{ author.givenName }}
											</span>
											<a
												v-if="author.orcid"
												:href="author.orcid"
												target="_blank"
											>
												<Icon
													icon="Orcid"
													:class="'relative top-[-2px] inline-block h-auto w-[16px] align-middle'"
													:inline="true"
												/>
											</a>
										</span>
									</div>
									<div v-if="citation.sourceName">
										{{ citation.sourceName }}
									</div>
									<div>
										<span v-if="citation.date">Date: {{ citation.date }}</span>
										<span v-if="citation.volume">
											Volume: {{ citation.volume }}
										</span>
										<span v-if="citation.issue">
											Issue number: {{ citation.issue }}
										</span>
										<span v-if="citation.firstPage && citation.lastPage">
											Pages: {{ citation.firstPage }} - {{ citation.lastPage }}
										</span>
									</div>
									<div class="w-fit p-1">{{ citation.rawCitation }}</div>
								</div>
							</TableCell>
							<TableCell class="align-top">
								<a
									class="pkpButton flex cursor-pointer items-center border-transparent py-2 text-lg-semibold text-primary hover:enabled:underline"
									@click="openEditModal(citation.id)"
								>
									<Icon
										icon="Edit"
										:class="'ms-2 inline-block h-auto w-6 align-middle'"
										:inline="true"
									/>
									{{ t('common.edit', []) }}
								</a>
							</TableCell>
							<TableCell class="align-top">
								<Icon
									@click="toggleMoreInfoMode(citationIndex)"
									:icon="!citation.isExpanded ? 'Dropdown' : 'Dropup'"
									:class="'ms-2 inline-block h-auto w-6 cursor-pointer py-2 align-middle'"
									:inline="true"
								/>
							</TableCell>
						</TableRow>
					</TableBody>
				</PkpTable>
			</div>
		</div>
	</div>
</template>

<script setup>
import {ref, computed, onMounted, watch, onBeforeUnmount, reactive} from 'vue';
import {t} from '@/utils/i18n';
import Search from '@/components/Search/Search.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableCell from '@/components/Table/TableCell.vue';
import Icon from '@/components/Icon/Icon.vue';
import {useModal} from '@/composables/useModal';
import {useForm} from '@/composables/useForm';
import ContributorsEditModal from '@/components/ListPanel/contributors/ContributorsEditModal.vue';
import {useUrl} from '@/composables/useUrl';
import cloneDeep from 'clone-deep';
import Form from '@/components/Form/Form.vue';
import ajaxErrorCallback from '@/mixins/ajaxError';

console.log(pkp);

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
	publicationApiUrlFormat: {
		type: String,
		required: true,
	},
	publication: {
		type: Object,
		required: true,
	},
	citationEditForm: {
		type: Object,
	}
});
const emit = defineEmits(['change', 'set-errors']);
const primaryLocale = props.primaryLocale;
const locales = props.locales;
const currentValue = computed({
	get: () => props.value,
	set: (newVal) => emit('change', props.name, 'value', newVal),
});
const supportedLocales = props.locales.map((language) => language.key);
const rawCitations = ref(
	'Hauschke C, Cartellieri S, Heller L (2018) Reference implementation for open scientometric indicators (ROSI). Research Ideas and Outcomes 4\n' +
		'Björk BC, Shen C, Laakso M (2016) A longitudinal study of independent scholar-published open access journals. PeerJ 4 https://doi.org/10.7717/peerj.1990\n' +
		'Heibi I, Peroni S, Shotton D (2019b) Crowdsourcing open citations with CROCI. An analysis of the current status of open citations, and a proposal. URL: https://arxiv.org/abs/1902.02534\n' +
		'Brown J (2019) Crossref grant IDs: a global, open database of funding information and identifiers. Autumn 2019 euroCRIS Strategic Membership Meeting. Strategic Membership Meeting 2019 – Autumn, Münster, Nov 18-20, 2019. euroCRIS, 33 pp. URL: http://hdl.handle.net/11366/1249\n' +
		'Bundesministerium für Bildung und Forschung (2020) Richtlinie. URL: https://www.bildung-forschung.digital/files/BAnz%20AT%2017.06.2020%20B3-1.pdf\n',
);
const allExpanded = ref(false);
const errors = computed(() => {
	if (!Object.keys(props.allErrors).includes(props.name)) {
		return [];
	}
	return props.allErrors[props.name];
});
const searchPhrase = ref('');

watch(searchPhrase, (newVal) => {
	console.log('watch searchPhrase', newVal);
});

let activeForm = null;
let activeFormTitle = null;
const isLoading = ref(false);

/**
 * Open the modal to edit an item
 *
 * @param {Number} id
 */
function openEditModal(id) {
	isLoading.value = true;
	const {apiUrl} = useUrl('citations/' + id);

	// const CitationEditForm = pageInitConfig.componentForms.citationEditForm;
	// const _useForm = useForm(FieldCitationEditModal);
	// _useForm.setValue('title', 'this is the title');

	// console.log(_useForm);
	console.log('openEditModal', id, apiUrl.value);

	// const {openSideModal} = useModal();
	// openSideModal(_useForm, {
	// 	title: 'Opened from FieldCitations.vue',
	// 	activeForm: FieldCitationEditModal,
	// 	onUpdateForm: updateForm,
	// 	onFormSuccess: formSuccess,
	// });
	//
	// $.ajax({
	// 	url: apiUrl,
	// 	type: 'GET',
	// 	error: ajaxErrorCallback,
	// 	// context: this,
	// 	success(author) {
	// 		let localActiveForm = cloneDeep(FieldCitationEditModal);
	// 		localActiveForm.action = apiUrl.value;
	// 		localActiveForm.method = 'PUT';
	// 		localActiveForm.fields = localActiveForm.fields.map((field) => {
	// 			field.value = author[field.name];
	// 			return field;
	// 		});
	// 		activeForm = localActiveForm;
	// 		activeFormTitle = t('grid.action.edit');
	// 		const {openSideModal} = useModal();
	// 		openSideModal(FieldCitationEditModal, {
	// 			title: activeFormTitle,
	// 			activeForm: activeForm,
	// 			onUpdateForm: updateForm,
	// 			onFormSuccess: formSuccess,
	// 		});
	// 		console.log(activeForm);
	// 	},
	// 	complete(r) {
	// 		isLoading.value = false;
	// 	},
	// });
}

/**
 * Clear the active form when the modal is closed
 *
 * @param {Object} event
 */
function closeFormModal(event) {
	const {closeSideModal} = useModal();
	closeSideModal(ContributorsEditModal);
	this.activeForm = null;
	this.activeFormTitle = '';
}

/**
 * The add/edit form has been successfully
 * submitted.
 *
 * @param {Object} contributor
 */
function formSuccess(contributor) {
	if (this.activeForm.method === 'POST') {
		this.offset = 0;

		const newContributors = [...this.publication.authors];
		newContributors.push(contributor);
		this.$emit('updated:contributors', newContributors);
	} else {
		const newContributors = this.publication.authors.map((author) => {
			if (author.id === contributor.id) {
				return contributor;
			}
			return author;
		});
		this.$emit('updated:contributors', newContributors);
	}
	this.closeFormModal();

	this.getAndUpdatePublication();
}

/**
 * Update form values when they change
 *
 * @param {String} formId
 * @param {Object} data
 */
function updateForm(formId, data) {
	if (!activeForm) {
		return;
	}

	let activeForm = $parent.activeForm;
	Object.keys(data).forEach(function (key) {
		activeForm[key] = data[key];
	});
	$parent.activeForm = activeForm;
}

function toggleAllExpanded() {
	allExpanded.value = !allExpanded.value;
}

function toggleMoreInfoMode(index) {
	if (!currentValue.value[index]['isExpanded']) {
		currentValue.value[index]['isExpanded'] = false;
	}
	currentValue.value[index]['isExpanded'] =
		!currentValue.value[index]['isExpanded'];
}

onBeforeUnmount(() => {
	emit('set-errors', props.name, []);
});
</script>
