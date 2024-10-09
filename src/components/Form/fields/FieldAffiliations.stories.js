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
			const apiUrl = 'http://localhost/ojs350-multiple-author-affiliations-gy/index.php/publicknowledge/api/v1/rors/?search='
			const rorsApiResponse = args.rorsApiResponse;
			const newAffiliation = args.newItem;
			let organizations = rorsApiResponse.items;

			const dotsActions = [
				{
					"label": "Edit institute name",
					"name": "dummyAction",
				},
				{
					"label": "Remove institution",
					"name": "dummyAction",
				},
			];

			const handleAction = function (name) {
				switch (name) {
					case 'dummyAction':
						dummyAction();
						break;
					default:
						console.error(`No handler for action: ${name}`);
				}
			}

			const value = reactive(args.items);

			const valueHelper = reactive(setValueHelper(value));

			function setValueHelper(value) {
				let newValue = {};

				Object.keys(value).forEach(key => {
					newValue[key] = {}; // value[key];
					newValue[key].actions = false;
					newValue[key].editMode = false;
					newValue[key].editable = !value[key]._data.ror;
				});

				return newValue;
			}

			const pendingRequests = new WeakMap();
			const minimumSearchPhraseLength = 3;

			const primaryLocale = $.pkp.app.primaryLocale;

			const searchPhrase = ref('');

			const translations = function (row) {
				let names = row._data.name;
				let total = Object.keys(names).length;
				let translated = 0;

				for (let key in names) {
					if (names[key].length > 0) {
						translated++;
					}
				}

				if (total === translated) {
					return t('user.affiliations.translationAll', {});
				} else {
					return t('user.affiliations.translationSome',
						{translated: translated, total: total});
				}
			};

			const toggleTranslations = function (affiliationId) {
				console.log(affiliationId);
				console.log(value[affiliationId]);
			};

			const apiLookup = function () {
				let rors = [];

				// const previousController = pendingRequests.get(this);
				// if (previousController) previousController.abort();

				if (searchPhrase.value.length < minimumSearchPhraseLength) return;

				// const controller = new AbortController();
				// pendingRequests.set(this, controller);

				fetch(apiUrl + searchPhrase.value, {
					// signal: controller.signal
				})
					.then(response => response.json())
					.then(data => {
						let items = data.items;
						for (let i = 0; i < items.length; i++) {
							rors.push(items[i]);
						}
						organizations = items;
					})
					.catch(error => {
						if (error.name === 'AbortError') return;
						console.log(error);
					});
			}

			const lookupSearchPhrase = function () {
				if (searchPhrase.value.length >= 3) {
					// apiLookup();
					// organizations = rorsApiResponse;
					console.log('searchPhrase: ' + searchPhrase.value);
				}
			};

			const isReadOnly = function (row) {
				return !!row._data.ror;
			};

			const newGuid = function () {
				return "10000000100040008000100000000000".replace(/[018]/g, c =>
					(+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
				);
			}

			const toggleActions = function (affiliationId) {
				valueHelper[affiliationId].actions = !valueHelper[affiliationId].actions;
			};

			const toggleEdit = function (affiliationId) {
				valueHelper[affiliationId].editMode = !valueHelper[affiliationId].editMode;
			};

			const closeEdit = function (affiliationId) {
				valueHelper[affiliationId].editMode = !valueHelper[affiliationId].editMode;
				valueHelper[affiliationId].actions = false;
			};

			const deleteAffiliation = function (affiliationId) {
				console.log('Affiliation: ' + affiliationId + ' deleted');
				valueHelper[affiliationId].actions = false;
			}

			const dummyAction = function (message) {
				alert('"' + message + '"' + ' clicked');
			};

			return {
				value,
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
