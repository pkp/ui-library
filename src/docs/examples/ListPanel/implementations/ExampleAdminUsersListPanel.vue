<script>
import UsersListPanel from '@/components/ListPanel/users/UsersListPanel.vue';
import ExampleUsersListPanel from './ExampleUsersListPanel.vue';

export default {
	extends: UsersListPanel,
	name: 'ExampleAdminUsersListPanel',
	data: function () {
		let data = ExampleUsersListPanel.data();
		data.isSiteAdmin = true;
		data.contextId = 0;

		let journalManager = {
			'id': 21,
			'name': {
				'en_US': 'Journal Manager',
				'fr_CA': 'FR Journal Manager',
			},
			'abbrev': {
				'en_US': 'JM',
				'fr_CA': 'FJM',
			},
			'roleId': 16,
			'contextId': 2,
			'showTitle': true,
			'permitSelfRegistration': false,
			'recommendOnly': false,
		};

		let sectionEditor = {
			'id': 24,
			'name': {
				'en_US': 'Section Editor',
				'fr_CA': 'FR Section Editor',
			},
			'abbrev': {
				'en_US': 'SE',
				'fr_CA': 'FSE',
			},
			'roleId': 17,
			'contextId': 2,
			'showTitle': false,
			'permitSelfRegistration': false,
			'recommendOnly': true,
		};

		let copyEditor = {
			'id': 25,
			'name': {
				'en_US': 'Copyeditor',
				'fr_CA': 'FR Copyeditor',
			},
			'abbrev': {
				'en_US': 'CE',
				'fr_CA': 'FCE',
			},
			'roleId': 4097,
			'contextId': 2,
			'showTitle': false,
			'permitSelfRegistration': false,
			'recommendOnly': false,
		};

		data.items[0].groups.push(sectionEditor);
		data.items[1].groups.push(copyEditor);
		data.items[2].groups.push(journalManager);
		data.items[3].groups.push(copyEditor);

		delete data.filters['userGroups'];

		data.filters.roles = {
			heading: 'Roles',
			filters: [
				{
					param: 'userGroupIds',
					val: 0,
					title: 'No assigned roles',
				},
				{
					param: 'roleIds',
					val: 1,
					title: 'Site Admin',
				},
				{
					param: 'roleIds',
					val: 16,
					title: 'Journal Manager',
				},
				{
					param: 'roleIds',
					val: 17,
					title: 'Subeditor',
				},
				{
					param: 'roleIds',
					val: 4097,
					title: 'Assistant',
				},
				{
					param: 'roleIds',
					val: 2097152,
					title: 'Subscription Manager',
				},
				{
					param: 'roleIds',
					val: 65536,
					title: 'Author',
				},
				{
					param: 'roleIds',
					val: 4096,
					title: 'Reviewer',
				},
				{
					param: 'roleIds',
					val: 1048576,
					title: 'Reader',
				},
			],
		};

		data.filters.contextIds = {
			heading: 'Journals',
			isAutoSuggest: true,
			filters: [
				{
					'param': 'contextIds',
					'title': 'Lorem concederem, amet, ego, intellegitur',
					'acronym': 'LCA',
					'val': 0,
				},
				{
					'param': 'contextIds',
					'title': 'ipsum tot intellegitur interesse esset,',
					'acronym': 'ITI',
					'val': 1,
				},
				{
					'param': 'contextIds',
					'title': 'dolor Arcesilas et quot quot',
					'acronym': 'DAE',
					'val': 2,
				},
				{
					'param': 'contextIds',
					'title': 'sit Reges: fuit si quo',
					'acronym': 'SRF',
					'val': 3,
				},
				{
					'param': 'contextIds',
					'title': 'amet, interesse esse, tot bonis',
					'acronym': 'AIE',
					'val': 4,
				},
				{
					'param': 'contextIds',
					'title': 'consectetur vivendum neque quot omnis',
					'acronym': 'CVN',
					'val': 5,
				},
				{
					'param': 'contextIds',
					'title': 'adipiscing Reges: quidem intellegitur quiddam',
					'acronym': 'ARQ',
					'val': 6,
				},
				{
					'param': 'contextIds',
					'title': 'elit. beate ipsum sit verba.',
					'acronym': 'EBI',
					'val': 7,
				},
				{
					'param': 'contextIds',
					'title': 'Huic meministi, consectetur non variari,',
					'acronym': 'HMC',
					'val': 8,
				},
				{
					'param': 'contextIds',
					'title': 'ego, tot sit Duo neque',
					'acronym': 'ETS',
					'val': 9,
				},
				{
					'param': 'contextIds',
					'title': 'si mihi quo medium cum',
					'acronym': 'SMQ',
					'val': 10,
				},
				{
					'param': 'contextIds',
					'title': 'negaret Arcesilas inquit, etiam; satisfacit,',
					'acronym': 'NAI',
					'val': 11,
				},
				{
					'param': 'contextIds',
					'title': 'quicquam esse, Peripatetici, ad quo',
					'acronym': 'QEP',
					'val': 12,
				},
				{
					'param': 'contextIds',
					'title': 'interesse ad aeque tuus, medium',
					'acronym': 'IAA',
					'val': 13,
				},
				{
					'param': 'contextIds',
					'title': 'ad vivendum Peripatetici, meministi, quidem',
					'acronym': 'AVP',
					'val': 14,
				},
				{
					'param': 'contextIds',
					'title': 'beate aeque in medium dixerim',
					'acronym': 'BAI',
					'val': 15,
				},
				{
					'param': 'contextIds',
					'title': 'vivendum voluptatem? contrariis. ego, non',
					'acronym': 'VVC',
					'val': 16,
				},
				{
					'param': 'contextIds',
					'title': 'quali tot contrariis. victu, detractus',
					'acronym': 'QTC',
					'val': 17,
				},
				{
					'param': 'contextIds',
					'title': 'uteretur dixerim etsi fuit; eadem',
					'acronym': 'UDE',
					'val': 18,
				},
				{
					'param': 'contextIds',
					'title': 'victu, aeque voluptatem? dixerim quiddam',
					'acronym': 'VAV',
					'val': 19,
				},
				{
					'param': 'contextIds',
					'title': 'concederem, negaret disserendo locis esset,',
					'acronym': 'CND',
					'val': 20,
				},
				{
					'param': 'contextIds',
					'title': 'laudarem paulo fuit; et pertinacior,',
					'acronym': 'LPF',
					'val': 21,
				},
				{
					'param': 'contextIds',
					'title': 'etiam; re paulo paulo in',
					'acronym': 'ERP',
					'val': 22,
				},
				{
					'param': 'contextIds',
					'title': 'Quid Et ipsum Reges: ego,',
					'acronym': 'QEI',
					'val': 23,
				},
				{
					'param': 'contextIds',
					'title': 'paulo non Duo satisfacit, tuus,',
					'acronym': 'PND',
					'val': 24,
				},
				{
					'param': 'contextIds',
					'title': 'ante, interesse Et consectetur laudarem',
					'acronym': 'AIE',
					'val': 25,
				},
				{
					'param': 'contextIds',
					'title': 'inquit, ponatur in ad elit.',
					'acronym': 'IPI',
					'val': 26,
				},
				{
					'param': 'contextIds',
					'title': 'dixerim tuus, Cum quali fuit;',
					'acronym': 'DTC',
					'val': 27,
				},
				{
					'param': 'contextIds',
					'title': 'nonne quiddam elit. Sed defendunt,',
					'acronym': 'NQE',
					'val': 28,
				},
				{
					'param': 'contextIds',
					'title': 'meministi, bonis negaret Re Sed',
					'acronym': 'MBN',
					'val': 29,
				},
				{
					'param': 'contextIds',
					'title': 'cum aeque sententiae; re id',
					'acronym': 'CAS',
					'val': 30,
				},
				{
					'param': 'contextIds',
					'title': 'omnis intellegitur laudarem uteretur concederem,',
					'acronym': 'OIL',
					'val': 31,
				},
				{
					'param': 'contextIds',
					'title': 'dolor tot concederem, inquit, elit.',
					'acronym': 'DTC',
					'val': 32,
				},
				{
					'param': 'contextIds',
					'title': 'detractus Ex quae constructio quot',
					'acronym': 'DEQ',
					'val': 33,
				},
				{
					'param': 'contextIds',
					'title': 'esset, in Et Cum bonis',
					'acronym': 'EIE',
					'val': 34,
				},
				{
					'param': 'contextIds',
					'title': 'variari, re beate vivendum Lorem',
					'acronym': 'VRB',
					'val': 35,
				},
				{
					'param': 'contextIds',
					'title': 'non augeri dolor Ex Cum',
					'acronym': 'NAD',
					'val': 36,
				},
				{
					'param': 'contextIds',
					'title': 'augeri non Et meministi, augeri',
					'acronym': 'ANE',
					'val': 37,
				},
				{
					'param': 'contextIds',
					'title': 'voluptatem? contrariis. esset, aeque tot',
					'acronym': 'VCE',
					'val': 38,
				},
				{
					'param': 'contextIds',
					'title': 'Et Re pluribus. meministi, fuit;',
					'acronym': 'ERP',
					'val': 39,
				},
				{
					'param': 'contextIds',
					'title': 'quidem pluribus. inquit, Peripatetici, omnis',
					'acronym': 'QPI',
					'val': 40,
				},
				{
					'param': 'contextIds',
					'title': 'Arcesilas locis adipiscing Huic beate',
					'acronym': 'ALA',
					'val': 41,
				},
				{
					'param': 'contextIds',
					'title': 'tuus, quidem quidem Peripatetici, locis',
					'acronym': 'TQQ',
					'val': 42,
				},
				{
					'param': 'contextIds',
					'title': 'etsi locis fuit; quali bonis',
					'acronym': 'ELF',
					'val': 43,
				},
				{
					'param': 'contextIds',
					'title': 'fuit esse, Lorem in laudarem',
					'acronym': 'FEL',
					'val': 44,
				},
				{
					'param': 'contextIds',
					'title': 'in mihi sententiae; disserendo detractus',
					'acronym': 'IMS',
					'val': 45,
				},
				{
					'param': 'contextIds',
					'title': 'disserendo ad Ex esset, interesse',
					'acronym': 'DAE',
					'val': 46,
				},
				{
					'param': 'contextIds',
					'title': 'pertinacior, quot locis satisfacit, amet,',
					'acronym': 'PQL',
					'val': 47,
				},
				{
					'param': 'contextIds',
					'title': 'tamen sententiae; esse, omnis victu,',
					'acronym': 'TSE',
					'val': 48,
				},
				{
					'param': 'contextIds',
					'title': 'noster eadem quot Cum verba.',
					'acronym': 'NEQ',
					'val': 49,
				},
				{
					'param': 'contextIds',
					'title': 'fuit; Ex quidem neque ante,',
					'acronym': 'FEQ',
					'val': 50,
				},
				{
					'param': 'contextIds',
					'title': 'Sed verba. laudarem omnis defendunt,',
					'acronym': 'SVL',
					'val': 51,
				},
				{
					'param': 'contextIds',
					'title': 'quot quae satisfacit, victu, esse,',
					'acronym': 'QQS',
					'val': 52,
				},
				{
					'param': 'contextIds',
					'title': 'homines, pluribus. noster etsi nonne',
					'acronym': 'HPN',
					'val': 53,
				},
				{
					'param': 'contextIds',
					'title': 'tot Arcesilas quiddam in ponatur',
					'acronym': 'TAQ',
					'val': 54,
				},
				{
					'param': 'contextIds',
					'title': 'sententiae; Arcesilas Quid intellegitur si',
					'acronym': 'SAQ',
					'val': 55,
				},
				{
					'param': 'contextIds',
					'title': 'Re ipsum voluptatem? dolor fugiunt,',
					'acronym': 'RIV',
					'val': 56,
				},
				{
					'param': 'contextIds',
					'title': 'mihi Huic elit. locis medium',
					'acronym': 'MHE',
					'val': 57,
				},
				{
					'param': 'contextIds',
					'title': 'non etiam; tot victu, omnis',
					'acronym': 'NET',
					'val': 58,
				},
				{
					'param': 'contextIds',
					'title': 'aeque Sed interesse Reges: locis',
					'acronym': 'ASI',
					'val': 59,
				},
				{
					'param': 'contextIds',
					'title': 'satisfacit, adipiscing esset, augeri detractus',
					'acronym': 'SAE',
					'val': 60,
				},
				{
					'param': 'contextIds',
					'title': 'et sententiae; non tamen neque',
					'acronym': 'ESN',
					'val': 61,
				},
				{
					'param': 'contextIds',
					'title': 'quidem mihi bonis detractus Re',
					'acronym': 'QMB',
					'val': 62,
				},
				{
					'param': 'contextIds',
					'title': 'locis satisfacit, etiam; Huic fuit',
					'acronym': 'LSE',
					'val': 63,
				},
				{
					'param': 'contextIds',
					'title': 'pluribus. Re uteretur ante, non',
					'acronym': 'PRU',
					'val': 64,
				},
				{
					'param': 'contextIds',
					'title': 'Ex satisfacit, inquit, Re Lorem',
					'acronym': 'ESI',
					'val': 65,
				},
				{
					'param': 'contextIds',
					'title': 'quo non homines, quali pertinacior,',
					'acronym': 'QNH',
					'val': 66,
				},
				{
					'param': 'contextIds',
					'title': 'intellegitur re ego, quicquam non',
					'acronym': 'IRE',
					'val': 67,
				},
				{
					'param': 'contextIds',
					'title': 'officium voluptatem? quod re et',
					'acronym': 'OVQ',
					'val': 68,
				},
				{
					'param': 'contextIds',
					'title': 'medium quali negaret neque quot',
					'acronym': 'MQN',
					'val': 69,
				},
				{
					'param': 'contextIds',
					'title': 'quiddam non Peripatetici, quidem etiam;',
					'acronym': 'QNP',
					'val': 70,
				},
				{
					'param': 'contextIds',
					'title': 'esse, omnis id homines, esset,',
					'acronym': 'EOI',
					'val': 71,
				},
				{
					'param': 'contextIds',
					'title': 'quod interesse aeque concederem, inquit,',
					'acronym': 'QIA',
					'val': 72,
				},
				{
					'param': 'contextIds',
					'title': 'neque victu, quidem aeque satisfacit,',
					'acronym': 'NVQ',
					'val': 73,
				},
				{
					'param': 'contextIds',
					'title': 'in Re laudarem interrete. pertinacior,',
					'acronym': 'IRL',
					'val': 74,
				},
				{
					'param': 'contextIds',
					'title': 'bonis quo mihi verba. Huic',
					'acronym': 'BQM',
					'val': 75,
				},
				{
					'param': 'contextIds',
					'title': 'ponatur variari, voluptatem? in fugiunt,',
					'acronym': 'PVV',
					'val': 76,
				},
				{
					'param': 'contextIds',
					'title': 'neque dixerim adipiscing intellegitur ipsum',
					'acronym': 'NDA',
					'val': 77,
				},
				{
					'param': 'contextIds',
					'title': 'in dixerim paulo interrete. ante,',
					'acronym': 'IDP',
					'val': 78,
				},
				{
					'param': 'contextIds',
					'title': 'contrariis. medium non Reges: tot',
					'acronym': 'CMN',
					'val': 79,
				},
				{
					'param': 'contextIds',
					'title': 'Duo etiam; concederem, re cum',
					'acronym': 'DEC',
					'val': 80,
				},
				{
					'param': 'contextIds',
					'title': 'Reges: esset, beate meministi, disserendo',
					'acronym': 'REB',
					'val': 81,
				},
				{
					'param': 'contextIds',
					'title': 'constructio etiam; dolor elit. laudarem',
					'acronym': 'CED',
					'val': 82,
				},
				{
					'param': 'contextIds',
					'title': 'interrete. intellegitur Reges: Huic defendunt,',
					'acronym': 'IIR',
					'val': 83,
				},
				{
					'param': 'contextIds',
					'title': 'Cum aeque esset, quo pertinacior,',
					'acronym': 'CAE',
					'val': 84,
				},
				{
					'param': 'contextIds',
					'title': 'id quo defendunt, negaret bonis',
					'acronym': 'IQD',
					'val': 85,
				},
				{
					'param': 'contextIds',
					'title': 'fugiunt, Arcesilas sententiae; sententiae; esset,',
					'acronym': 'FAS',
					'val': 86,
				},
				{
					'param': 'contextIds',
					'title': 're quae omnis quiddam augeri',
					'acronym': 'RQO',
					'val': 87,
				},
				{
					'param': 'contextIds',
					'title': 'eadem non cum Lorem sententiae;',
					'acronym': 'ENC',
					'val': 88,
				},
				{
					'param': 'contextIds',
					'title': 'defendunt, quicquam intellegitur id Peripatetici,',
					'acronym': 'DQI',
					'val': 89,
				},
				{
					'param': 'contextIds',
					'title': 'quae cum locis constructio esse,',
					'acronym': 'QCL',
					'val': 90,
				},
				{
					'param': 'contextIds',
					'title': 'Peripatetici, contrariis. verba. disserendo Re',
					'acronym': 'PCV',
					'val': 91,
				},
				{
					'param': 'contextIds',
					'title': 'verba. paulo pluribus. officium non',
					'acronym': 'VPP',
					'val': 92,
				},
			],
		};

		return data;
	},
};
</script>
