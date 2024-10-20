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
			const organizations = ref(args.rorsApiResponse['items']);
			const currentValue = args.items;

			// FieldAffiliations.vue
			const name = 'FieldAffiliations';

			const props = defineProps({
				value: {
					type: Object,
					default() {
						return {};
					}
				},
			});

			//fixme: get these from parent
			const apiUrl = pkp.context.apiBaseUrl + 'rors/?search=';
			const currentLocale = $.pkp.app.primaryLocale;
			const supportedLocales = ['en', 'de', 'fr_CA'];

			// const currentValue = props.value;
			// const organizations = ref([]);
			const newAffiliationPending = ref({});
			const searchPhrase = ref('');
			const newItemPrefix = 'new';
			let newItemCounter = 0;

			// Row actions
			const selectCustomOrganization = function () {
				newAffiliationPending.value = getNewItemTemplate();
				newAffiliationPending.value._data.name[currentLocale] = searchPhrase.value;
				showAddMode.value = true;
			}
			const selectRorOrganization = function (organization) {
				newAffiliationPending.value = getNewItemTemplate(organization);
				newAffiliationPending.value._data.ror = organization.ror;
				newAffiliationPending.value._data.name[currentLocale] = organization.name[currentLocale];
				searchPhrase.value = organization.name[currentLocale];
				showAddMode.value = true;
			}
			const addAffiliation = function () {
				newItemCounter++;
				let id = newItemPrefix + newItemCounter;
				currentValue[id] = JSON.parse(JSON.stringify(newAffiliationPending.value));

				// cleanup
				searchPhrase.value = '';
				showAddMode.value = false;
				if (typeof isStoryBook === 'undefined') {
					organizations.value = [];
				}
			}
			const deleteAffiliation = function (id) {
				if (confirm(t('user.affiliations.deleteInstitutionConfirmation',
					{institution: currentValue[id]['_data']['name'][currentLocale]}))
				) {
					delete currentValue[id];
				}
			}
			const rowActionsArgs = function (id) {
				let actions = [];

				if (currentValue[id]._helper.editable) {
					actions.push(
						{
							"label": t('user.affiliations.translationEditActionLabel', {}),
							"name": "edit",
							"id": id
						}
					);
				}

				actions.push(
					{
						"label": t('user.affiliations.translationDeleteActionLabel', {}),
						"name": "delete",
						"id": id
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
					const id = param[1].trim();

					switch (name) {
						case 'edit':
							toggleEdit(id);
							break;
						case 'delete':
							deleteAffiliation(id);
							break;
						default:
							console.error(`No handler for action: ${name}`);
					}
				}
			}

			// GUI
			const showAddMode = ref(false);
			const showSearchResults = computed(() => {
				return searchPhrase.value.length >= 3
					&& organizations.value.length > 0
					&& showAddMode.value === false;

			});
			const toggleEdit = function (id) {
				currentValue[id]._helper.editMode = !currentValue[id]._helper.editMode;
			};
			const closeEdit = function (id) {
				currentValue[id]._helper.editMode = false;
				currentValue[id]._helper.actions = false;
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
					makeCurrentValueConfirmComponent();
				},
				{immediate: true}
			);

			onMounted(() => {
				makeCurrentValueConfirmComponent();
			})

			// Misc
			function searchPhraseChanged() {
				if (typeof isStoryBook === 'undefined') {
					showAddMode.value = false;
					organizations.value = [];
					if (searchPhrase.value.length >= 3) {
						setTimeout(() => {
							apiLookup();
						}, 200);
					}
				}
			}

			function makeCurrentValueConfirmComponent() {
				Object.keys(currentValue).forEach(key => {
					supportedLocales.forEach((locale) => {
						if (!(locale in currentValue[key]._data.name)) {
							currentValue[key]._data.name[locale] = "";
						}
					});

					if (!currentValue[key]['_helper']) {
						currentValue[key]['_helper'] = getValueHelperSchema();
						currentValue[key]['_helper'].editable = !currentValue[key]._data.ror;
					}
				});
			}

			function getNewItemTemplate(organization) {
				let newItem = getAffiliationSchema();

				supportedLocales.forEach((locale) => {
					newItem._data.name[locale] = "";
				});

				return newItem;
			}

			function getAffiliationSchema() {
				// { "id": { }, ... }
				return {
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
					"_localesTable": {}
				};
			}

			function getValueHelperSchema() {
				return {
					actions: false,
					editMode: false,
					editable: false
				};
			}

			function getLocaleDisplayName(locale) {
				const localeNames = new Intl.DisplayNames(
					[currentLocale],
					{type: 'language'}
				);

				return localeNames.of(locale.replace('_', '-'));
			}

			function apiLookup() {
				fetch(apiUrl + searchPhrase.value, {})
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
