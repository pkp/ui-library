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
			const organizations = args.rorsApiResponse['items'];
			const currentValue = ref(args.items);

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

			// Search, select, add
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
				valueHelper[id] = getValueHelperSchema()
				valueHelper[id].editable = !id;

				// cleanup
				searchPhrase.value = '';
				organizations.value = [];
				showAddMode.value = false;
			}
			const deleteAffiliation = function (id) {
				if (confirm(t('user.affiliations.deleteInstitutionConfirmation',
					{institution: currentValue[id]['_data']['name'][currentLocale]}))
				) {
					delete currentValue[id];
					// delete valueHelper[id];
				}
			}

			function searchPhraseChanged() {
				showAddMode.value = false;
				organizations.value = [];
				if (searchPhrase.value.length >= 3) {
					setTimeout(() => {
						apiLookup();
					}, 200);
				}
			}

			// Row actions
			const rowActionsArgs = function (id) {
				let actions = [];

				if (valueHelper[id].editable) {
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
			const valueHelper = reactive(getValueHelper(currentValue));
			const showAddMode = ref(false);
			const showSearchResults = computed(() => {
				if (searchPhrase.value.length >= 3
					&& organizations.value.length > 0
					&& showAddMode.value === false) {
					return true;
				}
				return false;
			});
			const toggleEdit = function (id) {
				valueHelper[id].editMode = !valueHelper[id].editMode;
			};
			const closeEdit = function (id) {
				valueHelper[id].editMode = false;
				valueHelper[id].actions = false;
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
				Object.keys(currentValue).forEach(key => {
						if (!(key in valueHelper)) {
							valueHelper[key] = getValueHelperSchema();
						}
					},
					{immediate: true}
				);
			})

			onMounted(() => {
				makeValueConfirmAllowedLocales();
			})

			// Misc
			function makeValueConfirmAllowedLocales() {
				Object.keys(currentValue).forEach(key => {
					supportedLocales.forEach((locale) => {
						if (!(locale in currentValue[key]._data.name)) {
							currentValue[key]._data.name[locale] = "";
						}
					});
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

			function getValueHelper(value) {
				let newValue = {};

				Object.keys(value).forEach(key => {
					newValue[key] = getValueHelperSchema();
					newValue[key].editable = !value[key]._data.ror;
				});

				return newValue;
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
						<TableRow v-for="([id, row], aIndex) in Object.entries(value)" :key="id">
							<TableCell>
								{{ id }}
								<span v-if="!valueHelper[id].editMode">{{ row._data.name[primaryLocale] }}</span>
								<input
									v-if="valueHelper[id].editMode"
									:readonly="!valueHelper[id].editable"
									v-model="row._data.name[primaryLocale]"
									class="pkpFormField__input pkpFormField--text__input  pkpFormField--sizelarge"
								/>
								&nbsp;
								<Icon
									v-if="row._data.ror"
									:class="'mr-2'"
									:icon="'ror'"
									:inline="true"
								/>
							</TableCell>
							<TableCell>
								<div
									v-if="valueHelper[id].editMode"
									v-for="([key, value], index) in Object.entries(row._data.name)"
									:key="index">
									<div v-if="key !== primaryLocale">
										<p>{{ t('user.affiliations.translationLabel', {language: key}) }}</p>
										<p>
											<input
												v-model="row._data.name[key]"
												:readonly="!valueHelper[id].editable"
												class="pkpFormField__input pkpFormField--text__input pkp FormField--sizelarge"
											/>
										</p>
									</div>
								</div>
								<div>
									<button @click="toggleEdit(id)">
										{{ translations(row) }}
									</button>
								</div>
							</TableCell>
							<TableCell>
								<div v-if="!valueHelper[id].editMode">
									<button @click="toggleActions(id)">...</button>
									<div v-if="valueHelper[id].actions"
										 class="shadow text-primary affiliations__sticky">
										<ul>
											<li>
												<button @click="toggleEdit(id)">
													Edit
												</button>
											</li>
											<li>
												<button @click="deleteAffiliation(id)">
													Delete
												</button>
											</li>
										</ul>
									</div>
								</div>
								<div v-if="valueHelper[id].editMode">
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

			<div>
				<p> &nbsp; </p>
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
