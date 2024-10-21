import {computed, reactive, ref} from 'vue';
import DropdownActions from "@/components/DropdownActions/DropdownActions.vue";
import FieldAffiliations from './FieldAffiliations.vue';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableCell from '@/components/Table/TableCell.vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';
import FieldAffiliationsMock from '@/components/Form/mocks/field-affiliations';
import {t} from "@/utils/i18n";

export default {
	title: 'Forms/FieldAffiliations',
	component: FieldAffiliations,
	args: {},
	render: (args) => ({
		components: {
			DropdownActions,
			PkpTable,
			TableHeader,
			TableBody,
			TableRow,
			TableColumn,
			TableCell,
			PkpButton,
			Icon,
			t
		},
		setup() {
			// Storybook
			const isStoryBook = true;
			const currentValue = args.items;
			const organizations = ref(args.apiResponse['items']);
			const currentLocale = args.currentLocale;
			const supportedLocales = args.supportedLocales;

			// FieldAffiliations.vue
			const name = 'FieldAffiliations';

			const props = defineProps({
				value: {type: Array},
				currentLocale: {type: String},
				supportedLocales: {type: Object},
			});

			// const currentLocale = props.currentLocale;
			// const supportedLocales = props.supportedLocales;
			// const currentValue = props.value;
			// const organizations = ref([]);
			const newAffiliationPending = ref({});
			const searchPhrase = ref('');

			// Row actions
			const selectCustomOrganization = function () {
				newAffiliationPending.value = getNewItemTemplate();
				newAffiliationPending.value._data.name[currentLocale] = searchPhrase.value;
			}
			const selectRorOrganization = function (organization) {
				newAffiliationPending.value = getNewItemTemplate();
				newAffiliationPending.value._data.ror = organization.ror;
				newAffiliationPending.value._data.name[currentLocale] = organization.name[currentLocale];
				searchPhrase.value = organization.name[currentLocale];
			}
			const addAffiliation = function () {
				currentValue.push(JSON.parse(JSON.stringify(newAffiliationPending.value)));
				newAffiliationPending.value = {};
				searchPhrase.value = '';
				if (typeof isStoryBook === 'undefined') {
					organizations.value = [];
				}
			}
			const deleteAffiliation = function (index) {
				if (confirm(t('user.affiliations.deleteInstitutionConfirmation',
					{institution: currentValue[index]['_data']['name'][currentLocale]}))
				) {
					currentValue.splice(index, 1);
				}
			}
			const rowActionsArgs = function (index) {
				let actions = [];

				if (currentValue[index]._helper.editable) {
					actions.push(
						{
							"label": t('user.affiliations.translationEditActionLabel', {}),
							"name": "edit",
							"id": index
						}
					);
				}

				actions.push(
					{
						"label": t('user.affiliations.translationDeleteActionLabel', {}),
						"name": "delete",
						"id": index
					}
				);

				return {
					actions: actions,
					label: '...',
					ariaLabel: t('user.affiliations.translationActionsAriaLabel', {}),
					direction: 'left',
				};
			};
			const rowActionsHandler = function (param) {
				if (typeof (param) === 'object' && param.length === 2) {
					const name = param[0].trim();
					const index = param[1];

					switch (name) {
						case 'edit':
							toggleEditMode(index);
							break;
						case 'delete':
							deleteAffiliation(index);
							break;
						default:
							console.error(`No handler for action: ${name}`);
					}
				}
			}

			// GUI
			const showAddMode = computed(() => {
				return typeof newAffiliationPending.value._data !== 'undefined';
			});
			const showSearchResults = computed(() => {
				return searchPhrase.value.length >= 3
					&& organizations.value.length > 0
					&& showAddMode.value === false;
			});
			const toggleEditMode = function (index) {
				currentValue[index]._helper.editMode = !currentValue[index]._helper.editMode;
			};
			const closeEditMode = function (index) {
				currentValue[index]._helper.editMode = false;
				currentValue[index]._helper.actions = false;
			};
			const translations = function (row) {
				let names = row._data.name;
				let total = supportedLocales.length;
				let translated = 0;

				for (let key in names) {
					if (supportedLocales.includes(key)
						&& names[key].length > 0) {
						translated++;
					}
				}

				if (total === translated) {
					return t('user.affiliations.translationsAllAvailable', {});
				} else {
					return t('user.affiliations.translationsSomeAvailable',
						{translated: translated, total: total});
				}
			};

			// Hooks
			watch(currentValue, () => {
					makeCurrentValueCompatible();
				},
				{immediate: true}
			);

			onMounted(() => {
				makeCurrentValueCompatible();
			})

			// Misc
			function searchPhraseChanged() {
				newAffiliationPending.value = {};

				if (typeof isStoryBook !== 'undefined') {
					return;
				}

				organizations.value = [];
				if (searchPhrase.value.length >= 3) {
					setTimeout(() => {
						apiLookup();
					}, 200);
				}
			}

			function makeCurrentValueCompatible() {
				// if(typeof currentValue === 'undefined' || currentValue === null){
				// 	return;
				// }

				Object.keys(currentValue).forEach(index => {
					supportedLocales.forEach((locale) => {
						if (!(locale in currentValue[index]._data.name)) {
							currentValue[index]._data.name[locale] = "";
						}
					});

					if (!currentValue[index]['_helper']) {
						currentValue[index]['_helper'] = getHelperSchema();
					}
					currentValue[index]['_helper'].editable = !currentValue[index]._data.ror;
				});
			}

			function getNewItemTemplate() {
				let newItem = {
					"_data": {
						"id": null,
						"authorId": null,
						"ror": null,
						"name": {}
					},
					"_hasLoadableAdapters": false,
					"_metadataExtractionAdapters": [],
					"_extractionAdaptersLoaded": false,
					"_metadataInjectionAdapters": [],
					"_injectionAdaptersLoaded": false,
					"_localesTable": {},
					"_helper": getHelperSchema()
				};

				supportedLocales.forEach((locale) => {
					newItem._data.name[locale] = "";
				});

				return newItem;
			}

			function getHelperSchema() {
				return {
					actions: false,
					editMode: false,
					editable: false
				};
			}

			function getLocaleDisplayName(locale) {
				if(typeof Intl === 'undefined') {
					return locale;
				}

				const localeNames = new Intl.DisplayNames(
					[currentLocale],
					{type: 'language'}
				);

				return localeNames.of(locale.replace('_', '-'));
			}

			function apiLookup() {
				fetch(pkp.context.apiBaseUrl + 'rors/?search=' + searchPhrase.value, {})
					.then(response => response.json())
					.then(data => {
						organizations.value = [];
						if (data.items) {
							for (let i = 0; i < data.items.length; i++) {
								organizations.value.push(data.items[i]);
							}
						}
					})
					.catch(error => {
						console.log(error);
					});
			}

			return {
				currentValue,
				valueHelper,
				toggleActions,
				toggleEdit,
				closeEdit,
				deleteAffiliation,
				handleAction,
				dotsActions,
				rorsApiResponse,
				organizations,
				searchPhrase,
				primaryLocale,
				dummyAction,
				translations,
				lookupSearchPhrase,
				isReadOnly,
				toggleTranslations,
			};
		},
		template: `
			<div class="pkpFormField pkpFormAffiliations--html">
				<PkpTable aria-label="Affiliations">
					<TableHeader>
						<TableColumn id="">{{ t('user.affiliations.institution') }}</TableColumn>
						<TableColumn id="">{{ t('user.affiliations.translation') }}</TableColumn>
						<TableColumn id="">&nbsp;</TableColumn>
					</TableHeader>
					<TableBody>
						<TableRow v-for="([id, row], aIndex) in Object.entries(currentValue)" :key="id">
							<TableCell>
								<div v-if="row._helper.editMode"
									 class="pkpFormField pkpFormField--text pkpFormField--sizelarge">
									<div class="pkpFormField pkpFormField--text pkpFormField--sizelarge">
										<div class="pkpFormField__heading">
											<label class="pkpFormFieldLabel">
												<span v-if="!row._helper.editable">
													{{ getLocaleDisplayName(currentLocale) }}
												</span>
												<span v-if="row._helper.editable">
                                                  {{ t('user.affiliations.typeTranslationNameInLanguageLabel', {language: getLocaleDisplayName(currentLocale)}) }}
												</span>
											</label>
										</div>
										<div class="pkpFormField__control">
											<div class="pkpFormField__control_top">
												<input
													v-model="row._data.name[currentLocale]"
													:readonly="!row._helper.editable"
													:id="'contributors-affiliations-' + id + '-' + currentLocale"
													class="pkpFormField__input pkpFormField--text__input"
													type="text"
													name="searchPhraseInput"
													aria-invalid="0">
											</div>
										</div>
									</div>
								</div>
								<div v-if="!row._helper.editMode" class="pkpFormField__heading">
									<label class="pkpFormFieldLabel">{{ row._data.name[currentLocale] }}</label> &nbsp;
									<Icon v-if="!row._helper.editable" :icon="'ror'" :class="'mr-2'" :inline="true"/>
								</div>
							</TableCell>
							<TableCell>
								<div v-if="row._helper.editMode"
									 v-for="([locale1, val], index) in Object.entries(row._data.name)"
									 :key="index">
									<div v-if="locale1 !== currentLocale && supportedLocales.includes(locale1)">
										<div class="pkpFormField pkpFormField--text pkpFormField--sizelarge">
											<div class="pkpFormField pkpFormField--text pkpFormField--sizelarge">
												<div class="pkpFormField__heading">
													<label v-if="!row._helper.editable" class="pkpFormFieldLabel">
														{{ getLocaleDisplayName(locale1) }}
													</label>
													<label v-if="row._helper.editable">
														{{ t('user.affiliations.typeTranslationNameInLanguageLabel', {language: getLocaleDisplayName(locale1)}) }}
													</label>
												</div>
												<div class="pkpFormField__control">
													<div class="pkpFormField__control_top">
														<input
															v-model="row._data.name[locale1]"
															:readonly="!row._helper.editable"
															:id="'contributors-affiliations-' + id + '-' + locale1"
															class="pkpFormField__input pkpFormField--text__input"
															type="text"
															name="searchPhraseInput"
															aria-invalid="0">
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="pkpFormField__heading">
									<label class="pkpFormFieldLabel">
										<button @click="toggleEdit(id)">
											{{ translations(row) }}
										</button>
									</label>
								</div>
							</TableCell>
							<TableCell>
								<div v-if="!row._helper.editMode">
									<DropdownActions v-bind="rowActionsArgs(id)" @action="rowActionsHandler"/>
								</div>
								<div v-if="row._helper.editMode">
									<PkpButton @click="closeEdit(id)">Close</PkpButton>
								</div>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<div class="pkpFormField pkpFormField--text pkpFormField--sizelarge">
									<p>
										<label
											class="pkpFormFieldLabel"
											for="contributor-affiliations-searchPhrase-control">
											{{ t('user.affiliations.searchPhraseLabel', {}) }}
										</label>
									</p>
									<p>
										<input
											v-model="searchPhrase"
											@keyup="lookupSearchPhrase"
											id="contributor-affiliations-searchPhrase-control"
											class="pkpFormField__input pkpFormField--text__input pkpFormField--sizelarge"
											type="text"
											name="searchPhraseInput"
											aria-invalid="0">
									</p>
									<div v-if="searchPhrase" class="shadow text-primary searchPhraseOrganizations">
										<ul>
											<li v-for="(organization, orgIndex) in organizations">
												<button @click.prevent="dummyAction(orgIndex)" class="">
													{{ organization.id }} [
													{{ organization.name[primaryLocale] }}]
												</button>
											</li>
										</ul>
									</div>
								</div>
							</TableCell>
							<TableCell>&nbsp;</TableCell>
							<TableCell>
								<PkpButton @click="dummyAction('add')"> Add</PkpButton>
							</TableCell>
						</TableRow>
					</TableBody>
				</PkpTable>
			</div>

			<div style="margin-top: 10px; padding: 10px; border: 1px solid #ccc;">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel accumsan neque, ac tincidunt
					risus. Sed vulputate augue ut quam ultricies elementum. In pretium euismod ipsum nec
					consectetur. In eleifend sapien id porta lobortis. Fusce faucibus pharetra rutrum. Etiam
					sagittis iaculis placerat. Donec ut faucibus nibh, a auctor erat. Orci varius natoque penatibus
					et magnis dis parturient montes, nascetur ridiculus mus. Proin porttitor, nulla ac auctor
					bibendum, urna leo dignissim arcu, id viverra justo quam vel ligula. Fusce a tincidunt justo.
					Nulla vulputate accumsan massa, nec vulputate erat semper non.</p>
				<p> &nbsp; </p>
				<p>Nunc auctor mattis quam eu tempus. Integer ornare est libero, quis sollicitudin tortor commodo
					ac. Integer nisi mauris, pellentesque quis vehicula vitae, aliquet in ex. Praesent mattis metus
					non fermentum convallis. Integer lobortis libero ac malesuada eleifend. In consectetur felis
					efficitur nunc tempus luctus. Cras cursus mi non ipsum suscipit, non placerat purus interdum.
					Nulla blandit ultricies condimentum. Proin interdum nunc lacus, et gravida libero interdum
					nec.</p>
				<p> &nbsp; </p>
			</div>
		`,
	}),
};

export const Base = {
	args: {...FieldAffiliationsMock},
};
