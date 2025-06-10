export default {
	itemsMax: 25,
	items: [
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/29',
			contextId: 1,
			currentPublicationId: 31,
			dateLastActivity: '2023-10-31 09:35:10',
			dateSubmitted: '2023-10-30 14:19:02',
			id: 29,
			lastModified: '2023-10-30 14:19:02',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/29/publications/31',
					authorsString: 'Name 1 Author 1, Name 2 Author 2 (Author)',
					authorsStringIncludeInBrowse:
						'Name 1 Author 1, Name 2 Author 2 (Author)',
					authorsStringShort: 'Author 1 et al.',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: '2023-10-30',
					doiObject: {
						contextId: 1,
						crossrefplugin_batchId: null,
						crossrefplugin_failedMsg: null,
						crossrefplugin_successMsg: null,
						doi: '10.1234/5nbqtc03',
						id: 4,
						registrationAgency: null,
						resolvingUrl: 'https://doi.org/10.1234/5nbqtc03',
						status: 1,
					},
					fullTitle: {
						en: 'Test prefix Test title: Test subtitle',
						fr_CA: 'Test prefix FR Test title FR: Test subtitle FR',
					},
					galleys: [
						{
							'crossrefplugin::registeredDoi': null,
							'crossrefplugin::status': null,
							crossrefplugin_batchId: null,
							crossrefplugin_failedMsg: null,
							crossrefplugin_successMsg: null,
							doiObject: {
								contextId: 1,
								crossrefplugin_batchId: null,
								crossrefplugin_failedMsg: null,
								crossrefplugin_successMsg: null,
								doi: '10.1234/5g7gfx76',
								id: 5,
								registrationAgency: null,
								resolvingUrl: 'https://doi.org/10.1234/5g7gfx76',
								status: 1,
							},
							file: {
								_href:
									'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/29/files/58',
								assocId: 7,
								assocType: 521,
								caption: null,
								copyrightOwner: null,
								createdAt: '2023-10-30 14:19:31',
								creator: {
									en: '',
									fr_CA: '',
								},
								credit: null,
								'crossrefplugin::registeredDoi': null,
								'crossrefplugin::status': null,
								crossrefplugin_batchId: null,
								crossrefplugin_failedMsg: null,
								crossrefplugin_successMsg: null,
								dateCreated: null,
								dependentFiles: [],
								description: {
									en: '',
									fr_CA: '',
								},
								documentType: 'pdf',
								fileId: 41,
								fileStage: 10,
								genreId: 1,
								genreIsDependent: false,
								genreIsSupplementary: false,
								genreName: {
									en: 'Article Text',
									fr_CA: "Texte de l'article",
								},
								id: 58,
								language: null,
								locale: 'en',
								mimetype: 'application/pdf',
								name: {
									en: 'article.pdf',
									fr_CA: '',
								},
								path: 'journals/1/articles/29/653fbb73c2ac5.pdf',
								publisher: {
									en: '',
									fr_CA: '',
								},
								revisions: [],
								source: {
									en: '',
									fr_CA: '',
								},
								sourceSubmissionFileId: null,
								sponsor: {
									en: '',
									fr_CA: '',
								},
								subject: {
									en: '',
									fr_CA: '',
								},
								submissionId: 29,
								terms: null,
								updatedAt: '2023-10-30 14:19:32',
								uploaderUserId: 1,
								uploaderUserName: 'admin',
								url: 'http://localhost:7002/index.php/publicknowledge/$$$call$$$/api/file/file-api/download-file?submissionFileId=58&submissionId=29&stageId=5',
								viewable: null,
							},
							id: 7,
							isApproved: false,
							label: 'PDF',
							locale: 'en',
							'pub-id::publisher-id': null,
							publicationId: 31,
							seq: 0,
							submissionFileId: 58,
							urlPublished:
								'http://localhost:7002/index.php/publicknowledge/article/view/testing-dc-metadata-submission-16986755316642/version/31/7',
							urlRemote: null,
						},
					],
					id: 31,
					locale: 'en',
					pages: '71-98',
					prefix: {
						en: 'Test prefix',
						fr_CA: 'Test prefix FR',
					},
					primaryContactId: null,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 29,
					subtitle: {
						en: 'Test subtitle',
						fr_CA: 'Test subtitle FR',
					},
					title: {
						en: 'Test title',
						fr_CA: 'Test title FR',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/testing-dc-metadata-submission-16986755316642/version/31',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [],
			reviewRounds: [],
			stageId: 4,
			stageName: 'Copyediting',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/29',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/29',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/testing-dc-metadata-submission-16986755316642',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/29',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/26',
			contextId: 1,
			currentPublicationId: 27,
			dateLastActivity: '2023-10-30 14:17:48',
			dateSubmitted: '2023-10-30 14:17:46',
			id: 26,
			lastModified: '2023-10-30 14:17:46',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/26/publications/27',
					authorsString: 'Carlo Corino (Author)',
					authorsStringIncludeInBrowse: 'Carlo Corino (Author)',
					authorsStringShort: 'Corino',
					categoryIds: [5],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						fr_CA:
							'Phasellus hendrerit ligula non erat laoreet et feugiat risus varius',
						en: 'Ut enim ad minim veniam quis nostrud exercitation ullamco',
					},
					galleys: [],
					id: 27,
					locale: 'fr_CA',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 35,
					'pub-id::publisher-id': null,
					sectionId: 2,
					status: 1,
					submissionId: 26,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						fr_CA:
							'Phasellus hendrerit ligula non erat laoreet et feugiat risus varius',
						en: 'Ut enim ad minim veniam quis nostrud exercitation ullamco',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/26/version/27',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [],
			reviewRounds: [],
			stageId: 1,
			stageName: 'Submission',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/26',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/26',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/26',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/26',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/25',
			contextId: 1,
			currentPublicationId: 26,
			dateLastActivity: '2023-10-30 14:17:27',
			dateSubmitted: '2023-10-30 14:17:24',
			id: 25,
			lastModified: '2023-10-30 14:17:24',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/25/publications/26',
					authorsString: 'Carlo Corino (Author)',
					authorsStringIncludeInBrowse: 'Carlo Corino (Author)',
					authorsStringShort: 'Corino',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Massa tincidunt dui ut ornare lectus sit amet est',
						fr_CA: '',
					},
					galleys: [],
					id: 26,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 34,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 25,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						fr_CA: '',
						en: 'Massa tincidunt dui ut ornare lectus sit amet est',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/25/version/26',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [],
			reviewRounds: [],
			stageId: 1,
			stageName: 'Submission',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/25',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/25',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/25',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/25',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/24',
			contextId: 1,
			currentPublicationId: 25,
			dateLastActivity: '2023-11-02 11:54:48',
			dateSubmitted: '2023-10-30 14:16:59',
			id: 24,
			lastModified: '2023-10-30 14:16:59',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/24/publications/25',
					authorsString: 'Carlo Corino (Author)',
					authorsStringIncludeInBrowse: 'Carlo Corino (Author)',
					authorsStringShort: 'Corino',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Et malesuada fames ac turpis',
						fr_CA: '',
					},
					galleys: [],
					id: 25,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 33,
					'pub-id::publisher-id': null,
					sectionId: 2,
					status: 1,
					submissionId: 24,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Et malesuada fames ac turpis',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/24/version/25',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [],
			reviewRounds: [],
			stageId: 1,
			stageName: 'Submission',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: true,
					openQueryCount: 1,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: 'start',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/24',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/24',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/24',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/submission?id=24',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/23',
			contextId: 1,
			currentPublicationId: 24,
			dateLastActivity: '2023-10-30 14:16:18',
			dateSubmitted: '2023-10-30 14:16:16',
			id: 23,
			lastModified: '2023-10-30 14:16:16',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/23/publications/24',
					authorsString: 'Carlo Corino (Author)',
					authorsStringIncludeInBrowse: 'Carlo Corino (Author)',
					authorsStringShort: 'Corino',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Duis aute irure dolor in reprehenderit in voluptate',
						fr_CA: '',
					},
					galleys: [],
					id: 24,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 32,
					'pub-id::publisher-id': null,
					sectionId: 2,
					status: 1,
					submissionId: 23,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Duis aute irure dolor in reprehenderit in voluptate',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/23/version/24',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [],
			reviewRounds: [],
			stageId: 1,
			stageName: 'Submission',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/23',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/23',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/23',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/23',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/20',
			contextId: 1,
			currentPublicationId: 21,
			dateLastActivity: '2023-10-30 14:13:00',
			dateSubmitted: '2023-10-30 14:12:52',
			id: 20,
			lastModified: '2023-10-30 14:12:52',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/20/publications/21',
					authorsString: 'Catalin Fraser (Author)',
					authorsStringIncludeInBrowse: 'Catalin Fraser (Author)',
					authorsStringShort: 'Fraser',
					categoryIds: [2, 3],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Test submission wizard with categories',
						fr_CA: '',
					},
					galleys: [],
					id: 21,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 29,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 20,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Test submission wizard with categories',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/20/version/21',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [],
			reviewRounds: [],
			stageId: 1,
			stageName: 'Submission',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					statusId: 1,
					status: 'No editor has been assigned to this submission.',
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: 'start',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/20',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/20',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/20',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/submission?id=20',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/19',
			contextId: 1,
			currentPublicationId: 20,
			dateLastActivity: '2023-10-30 14:11:59',
			dateSubmitted: '2023-10-30 14:11:29',
			id: 19,
			lastModified: '2023-10-30 14:11:29',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/19/publications/20',
					authorsString: 'Zita Woods (Author)',
					authorsStringIncludeInBrowse: 'Zita Woods (Author)',
					authorsStringShort: 'Woods',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Finocchiaro: Arguments About Arguments',
						fr_CA: '',
					},
					galleys: [],
					id: 20,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 28,
					'pub-id::publisher-id': null,
					sectionId: 2,
					status: 1,
					submissionId: 19,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Finocchiaro: Arguments About Arguments',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/19/version/20',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [
				{
					id: 26,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 13,
				},
				{
					id: 27,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 13,
				},
			],
			reviewRounds: [
				{
					id: 13,
					round: 1,
					stageId: 3,
					statusId: 4,
					status: 'Submission accepted.',
				},
			],
			stageId: 4,
			stageName: 'Copyediting',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					statusId: 4,
					status: 'Submission accepted.',
					files: {
						count: 0,
					},
					currentUserCanRecommendOnly: false,
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/19',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/19',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/19',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/19',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/17',
			contextId: 1,
			currentPublicationId: 18,
			dateLastActivity: '2023-10-31 11:48:30',
			dateSubmitted: '2023-10-30 14:09:47',
			id: 17,
			lastModified: '2023-10-30 14:09:47',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/17/publications/18',
					authorsString: 'Vajiheh Karbasizaed (Author)',
					authorsStringIncludeInBrowse: 'Vajiheh Karbasizaed (Author)',
					authorsStringShort: 'Karbasizaed',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: '2023-10-30',
					doiObject: {
						contextId: 1,
						crossrefplugin_batchId: null,
						crossrefplugin_failedMsg: null,
						crossrefplugin_successMsg: null,
						doi: '10.1234/0zvv6v41',
						id: 2,
						registrationAgency: null,
						resolvingUrl: 'https://doi.org/10.1234/0zvv6v41',
						status: 1,
					},
					fullTitle: {
						en: 'Antimicrobial, heavy metal resistance and plasmid profile of coliforms isolated from nosocomial infections in a hospital in Isfahan, Iran',
						fr_CA: '',
					},
					galleys: [
						{
							'crossrefplugin::registeredDoi': null,
							'crossrefplugin::status': null,
							crossrefplugin_batchId: null,
							crossrefplugin_failedMsg: null,
							crossrefplugin_successMsg: null,
							doiObject: {
								contextId: 1,
								crossrefplugin_batchId: null,
								crossrefplugin_failedMsg: null,
								crossrefplugin_successMsg: null,
								doi: '10.1234/jt1q1t63',
								id: 3,
								registrationAgency: null,
								resolvingUrl: 'https://doi.org/10.1234/jt1q1t63',
								status: 1,
							},
							file: {
								_href:
									'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/17/files/40',
								assocId: 3,
								assocType: 521,
								caption: null,
								copyrightOwner: null,
								createdAt: '2023-10-30 14:10:30',
								creator: {
									en: '',
									fr_CA: '',
								},
								credit: null,
								'crossrefplugin::registeredDoi': null,
								'crossrefplugin::status': null,
								crossrefplugin_batchId: null,
								crossrefplugin_failedMsg: null,
								crossrefplugin_successMsg: null,
								dateCreated: null,
								dependentFiles: [],
								description: {
									en: '',
									fr_CA: '',
								},
								documentType: 'pdf',
								fileId: 24,
								fileStage: 10,
								genreId: 1,
								genreIsDependent: false,
								genreIsSupplementary: false,
								genreName: {
									en: 'Article Text',
									fr_CA: "Texte de l'article",
								},
								id: 40,
								language: null,
								locale: 'en',
								mimetype: 'application/pdf',
								name: {
									en: 'article.pdf',
									fr_CA: '',
								},
								path: 'journals/1/articles/17/653fb95626af0.pdf',
								publisher: {
									en: '',
									fr_CA: '',
								},
								revisions: [],
								source: {
									en: '',
									fr_CA: '',
								},
								sourceSubmissionFileId: null,
								sponsor: {
									en: '',
									fr_CA: '',
								},
								subject: {
									en: '',
									fr_CA: '',
								},
								submissionId: 17,
								terms: null,
								updatedAt: '2023-10-30 14:10:30',
								uploaderUserId: 3,
								uploaderUserName: 'dbarnes',
								url: 'http://localhost:7002/index.php/publicknowledge/$$$call$$$/api/file/file-api/download-file?submissionFileId=40&submissionId=17&stageId=5',
								viewable: null,
							},
							id: 3,
							isApproved: false,
							label: 'PDF',
							locale: 'en',
							'pub-id::publisher-id': null,
							publicationId: 18,
							seq: 0,
							submissionFileId: 40,
							urlPublished:
								'http://localhost:7002/index.php/publicknowledge/article/view/17/version/18/3',
							urlRemote: null,
						},
					],
					id: 18,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 26,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 17,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Antimicrobial, heavy metal resistance and plasmid profile of coliforms isolated from nosocomial infections in a hospital in Isfahan, Iran',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/17/version/18',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [
				{
					id: 24,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 12,
				},
				{
					id: 25,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 12,
				},
			],
			reviewRounds: [
				{
					id: 12,
					round: 1,
					stageId: 3,
					statusId: 4,
					status: 'Submission accepted.',
				},
			],
			stageId: 5,
			stageName: 'Production',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					statusId: 4,
					status: 'Submission accepted.',
					files: {
						count: 0,
					},
					currentUserCanRecommendOnly: false,
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/17',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/17',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/17',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/17',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/16',
			contextId: 1,
			currentPublicationId: 17,
			dateLastActivity: '2023-10-30 14:09:39',
			dateSubmitted: '2023-10-30 14:09:36',
			id: 16,
			lastModified: '2023-10-30 14:09:36',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/16/publications/17',
					authorsString: 'Rosanna Rossi (Author)',
					authorsStringIncludeInBrowse: 'Rosanna Rossi (Author)',
					authorsStringShort: 'Rossi',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Influence of long-term nutrition with different dietary fats on fatty acid composition of heavy pigs backfat',
						fr_CA: '',
					},
					galleys: [],
					id: 17,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 25,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 16,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Influence of long-term nutrition with different dietary fats on fatty acid composition of heavy pigs backfat',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/16/version/17',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [],
			reviewRounds: [],
			stageId: 1,
			stageName: 'Submission',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/16',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/16',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/16',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/16',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/15',
			contextId: 1,
			currentPublicationId: 16,
			dateLastActivity: '2023-10-30 14:09:29',
			dateSubmitted: '2023-10-30 14:08:52',
			id: 15,
			lastModified: '2023-10-30 14:08:52',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/15/publications/16',
					authorsString: 'Rana Baiyewu (Author)',
					authorsStringIncludeInBrowse: 'Rana Baiyewu (Author)',
					authorsStringShort: 'Baiyewu',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Yam diseases and its management in Nigeria',
						fr_CA: '',
					},
					galleys: [],
					id: 16,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 24,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 15,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Yam diseases and its management in Nigeria',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/15/version/16',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [
				{
					id: 23,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 11,
				},
				{
					id: 22,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 11,
				},
			],
			reviewRounds: [
				{
					id: 11,
					round: 1,
					stageId: 3,
					statusId: 4,
					status: 'Submission accepted.',
				},
			],
			stageId: 5,
			stageName: 'Production',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					statusId: 4,
					status: 'Submission accepted.',
					files: {
						count: 0,
					},
					currentUserCanRecommendOnly: false,
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/15',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/15',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/15',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/15',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/14',
			contextId: 1,
			currentPublicationId: 15,
			dateLastActivity: '2023-10-30 14:08:44',
			dateSubmitted: '2023-10-30 14:08:41',
			id: 14,
			lastModified: '2023-10-30 14:08:41',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/14/publications/15',
					authorsString: 'Patricia Daniel (Author)',
					authorsStringIncludeInBrowse: 'Patricia Daniel (Author)',
					authorsStringShort: 'Daniel',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Towards Designing an Intercultural Curriculum: A Case Study from the Atlantic Coast of Nicaragua',
						fr_CA: '',
					},
					galleys: [],
					id: 15,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 23,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 14,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Towards Designing an Intercultural Curriculum: A Case Study from the Atlantic Coast of Nicaragua',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/14/version/15',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [],
			reviewRounds: [],
			stageId: 1,
			stageName: 'Submission',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/14',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/14',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/14',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/14',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/13',
			contextId: 1,
			currentPublicationId: 14,
			dateLastActivity: '2023-11-02 11:53:19',
			dateSubmitted: '2023-10-30 14:07:22',
			id: 13,
			lastModified: '2023-10-30 14:07:22',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/13/publications/14',
					authorsString: 'Lise Kumiega (Author)',
					authorsStringIncludeInBrowse: 'Lise Kumiega (Author)',
					authorsStringShort: 'Kumiega',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Hydrologic Connectivity in the Edwards Aquifer between San Marcos Springs and Barton Springs during 2009 Drought Conditions',
						fr_CA: '',
					},
					galleys: [],
					id: 14,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 22,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 13,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Hydrologic Connectivity in the Edwards Aquifer between San Marcos Springs and Barton Springs during 2009 Drought Conditions',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/13/version/14',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [
				{
					id: 19,
					isCurrentUserAssigned: false,
					statusId: 9,
					status:
						'This review is complete and the reviewer has been thanked for their contribution.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 10,
				},
				{
					id: 20,
					isCurrentUserAssigned: false,
					statusId: 9,
					status:
						'This review is complete and the reviewer has been thanked for their contribution.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 10,
				},
				{
					id: 21,
					isCurrentUserAssigned: false,
					statusId: 9,
					status:
						'This review is complete and the reviewer has been thanked for their contribution.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 10,
				},
			],
			reviewRounds: [
				{
					id: 10,
					round: 1,
					stageId: 3,
					statusId: 1,
					status: 'Revisions have been requested.',
				},
			],
			stageId: 3,
			stageName: 'Review',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					statusId: 1,
					status: 'Revisions have been requested.',
					files: {
						count: 0,
					},
					currentUserCanRecommendOnly: false,
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/13',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/13',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/13',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/13',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/12',
			contextId: 1,
			currentPublicationId: 13,
			dateLastActivity: '2023-10-30 14:13:09',
			dateSubmitted: '2023-10-30 14:06:50',
			id: 12,
			lastModified: '2023-10-30 14:06:50',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/12/publications/13',
					authorsString: 'Leo Christopher (Author)',
					authorsStringIncludeInBrowse: 'Leo Christopher (Author)',
					authorsStringShort: 'Christopher',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Sodium butyrate improves growth performance of weaned piglets during the first period after weaning',
						fr_CA: '',
					},
					galleys: [],
					id: 13,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 21,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 12,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Sodium butyrate improves growth performance of weaned piglets during the first period after weaning',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/12/version/13',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [
				{
					id: 17,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 9,
				},
				{
					id: 18,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 9,
				},
			],
			reviewRounds: [
				{
					id: 9,
					round: 1,
					stageId: 3,
					statusId: 8,
					status: 'New reviews have been submitted.',
				},
			],
			stageId: 3,
			stageName: 'Review',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					statusId: 8,
					status: 'New reviews have been submitted.',
					files: {
						count: 0,
					},
					currentUserCanRecommendOnly: false,
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/12',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/12',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/12',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/12',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/11',
			contextId: 1,
			currentPublicationId: 12,
			dateLastActivity: '2023-10-30 14:06:42',
			dateSubmitted: '2023-10-30 14:06:39',
			id: 11,
			lastModified: '2023-10-30 14:06:39',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/11/publications/12',
					authorsString: 'Karim Al-Khafaji, Margaret Morse (Author)',
					authorsStringIncludeInBrowse:
						'Karim Al-Khafaji, Margaret Morse (Author)',
					authorsStringShort: 'Al-Khafaji et al.',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Learning Sustainable Design through Service',
						fr_CA: '',
					},
					galleys: [],
					id: 12,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 19,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 11,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Learning Sustainable Design through Service',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/11/version/12',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [],
			reviewRounds: [],
			stageId: 1,
			stageName: 'Submission',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/11',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/11',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/11',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/11',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/10',
			contextId: 1,
			currentPublicationId: 11,
			dateLastActivity: '2023-10-30 14:06:31',
			dateSubmitted: '2023-10-30 14:05:47',
			id: 10,
			lastModified: '2023-10-30 14:05:47',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/10/publications/11',
					authorsString: 'John Novak (Author)',
					authorsStringIncludeInBrowse: 'John Novak (Author)',
					authorsStringShort: 'Novak',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Condensing Water Availability Models to Focus on Specific Water Management Systems',
						fr_CA: '',
					},
					galleys: [],
					id: 11,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 18,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 10,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Condensing Water Availability Models to Focus on Specific Water Management Systems',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/10/version/11',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [
				{
					id: 16,
					isCurrentUserAssigned: false,
					statusId: 7,
					status: 'The reviewer has submitted their review.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 8,
				},
				{
					id: 15,
					isCurrentUserAssigned: false,
					statusId: 7,
					status: 'The reviewer has submitted their review.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 8,
				},
			],
			reviewRounds: [
				{
					id: 8,
					round: 1,
					stageId: 3,
					statusId: 8,
					status: 'New reviews have been submitted.',
				},
			],
			stageId: 3,
			stageName: 'Review',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					statusId: 8,
					status: 'New reviews have been submitted.',
					files: {
						count: 0,
					},
					currentUserCanRecommendOnly: false,
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/10',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/10',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/10',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/10',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/9',
			contextId: 1,
			currentPublicationId: 10,
			dateLastActivity: '2023-10-30 14:05:40',
			dateSubmitted: '2023-10-30 14:05:03',
			id: 9,
			lastModified: '2023-10-30 14:05:03',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/9/publications/10',
					authorsString: 'Fabio Paglieri (Author)',
					authorsStringIncludeInBrowse: 'Fabio Paglieri (Author)',
					authorsStringShort: 'Paglieri',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Hansen & Pinto: Reason Reclaimed',
						fr_CA: '',
					},
					galleys: [],
					id: 10,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 17,
					'pub-id::publisher-id': null,
					sectionId: 2,
					status: 1,
					submissionId: 9,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Hansen & Pinto: Reason Reclaimed',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/9/version/10',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [
				{
					id: 13,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 7,
				},
				{
					id: 14,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 7,
				},
			],
			reviewRounds: [
				{
					id: 7,
					round: 1,
					stageId: 3,
					statusId: 4,
					status: 'Submission accepted.',
				},
			],
			stageId: 5,
			stageName: 'Production',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					statusId: 4,
					status: 'Submission accepted.',
					files: {
						count: 0,
					},
					currentUserCanRecommendOnly: false,
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/9',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/9',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/9',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/9',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/8',
			contextId: 1,
			currentPublicationId: 9,
			dateLastActivity: '2023-10-30 14:04:54',
			dateSubmitted: '2023-10-30 14:04:51',
			id: 8,
			lastModified: '2023-10-30 14:04:51',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/8/publications/9',
					authorsString: 'Elinor Ostrom, Frank van Laerhoven (Author)',
					authorsStringIncludeInBrowse:
						'Elinor Ostrom, Frank van Laerhoven (Author)',
					authorsStringShort: 'Ostrom et al.',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Traditions and Trends in the Study of the Commons',
						fr_CA: '',
					},
					galleys: [],
					id: 9,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 15,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 8,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Traditions and Trends in the Study of the Commons',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/8/version/9',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [],
			reviewRounds: [],
			stageId: 1,
			stageName: 'Submission',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/8',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/8',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/8',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/8',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/7',
			contextId: 1,
			currentPublicationId: 8,
			dateLastActivity: '2023-10-30 14:04:44',
			dateSubmitted: '2023-10-30 14:04:03',
			id: 7,
			lastModified: '2023-10-30 14:04:03',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/7/publications/8',
					authorsString: 'Domatilia Sokoloff (Author)',
					authorsStringIncludeInBrowse: 'Domatilia Sokoloff (Author)',
					authorsStringShort: 'Sokoloff',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Developing efficacy beliefs in the classroom',
						fr_CA: '',
					},
					galleys: [],
					id: 8,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 14,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 7,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Developing efficacy beliefs in the classroom',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/7/version/8',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [
				{
					id: 11,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 6,
				},
				{
					id: 12,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 6,
				},
				{
					id: 10,
					isCurrentUserAssigned: false,
					statusId: 7,
					status: 'The reviewer has submitted their review.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 6,
				},
			],
			reviewRounds: [
				{
					id: 6,
					round: 1,
					stageId: 3,
					statusId: 6,
					status: 'Waiting for reviewers to be assigned.',
				},
			],
			stageId: 3,
			stageName: 'Review',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					statusId: 6,
					status: 'Waiting for reviewers to be assigned.',
					files: {
						count: 0,
					},
					currentUserCanRecommendOnly: false,
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/7',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/7',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/7',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/7',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/6',
			contextId: 1,
			currentPublicationId: 7,
			dateLastActivity: '2023-10-30 14:03:56',
			dateSubmitted: '2023-10-30 14:03:19',
			id: 6,
			lastModified: '2023-10-30 14:03:19',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/6/publications/7',
					authorsString: 'Dana Phillips (Author)',
					authorsStringIncludeInBrowse: 'Dana Phillips (Author)',
					authorsStringShort: 'Phillips',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: "Investigating the Shared Background Required for Argument: A Critique of Fogelin's Thesis on Deep Disagreement",
						fr_CA: '',
					},
					galleys: [],
					id: 7,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 13,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 6,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: "Investigating the Shared Background Required for Argument: A Critique of Fogelin's Thesis on Deep Disagreement",
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/6/version/7',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [
				{
					id: 8,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 5,
				},
				{
					id: 9,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 5,
				},
			],
			reviewRounds: [
				{
					id: 5,
					round: 1,
					stageId: 3,
					statusId: 4,
					status: 'Submission accepted.',
				},
			],
			stageId: 5,
			stageName: 'Production',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					statusId: 4,
					status: 'Submission accepted.',
					files: {
						count: 0,
					},
					currentUserCanRecommendOnly: false,
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/6',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/6',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/6',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/6',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/5',
			contextId: 1,
			currentPublicationId: 6,
			dateLastActivity: '2023-10-30 14:03:12',
			dateSubmitted: '2023-10-30 14:02:33',
			id: 5,
			lastModified: '2023-10-30 14:02:33',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/5/publications/6',
					authorsString: 'Diaga Diouf (Author)',
					authorsStringIncludeInBrowse: 'Diaga Diouf (Author)',
					authorsStringShort: 'Diouf',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Genetic transformation of forest trees',
						fr_CA: '',
					},
					galleys: [],
					id: 6,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 12,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 5,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Genetic transformation of forest trees',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/5/version/6',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [
				{
					id: 6,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 4,
				},
				{
					id: 7,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 4,
				},
			],
			reviewRounds: [
				{
					id: 4,
					round: 1,
					stageId: 3,
					statusId: 4,
					status: 'Submission accepted.',
				},
			],
			stageId: 5,
			stageName: 'Production',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					statusId: 4,
					status: 'Submission accepted.',
					files: {
						count: 0,
					},
					currentUserCanRecommendOnly: false,
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/5',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/5',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/5',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/5',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/4',
			contextId: 1,
			currentPublicationId: 5,
			dateLastActivity: '2023-10-30 14:02:24',
			dateSubmitted: '2023-10-30 14:02:21',
			id: 4,
			lastModified: '2023-10-30 14:02:21',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/4/publications/5',
					authorsString: 'Craig Montgomerie, Mark Irvine (Author)',
					authorsStringIncludeInBrowse:
						'Craig Montgomerie, Mark Irvine (Author)',
					authorsStringShort: 'Montgomerie et al.',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Computer Skill Requirements for New and Existing Teachers: Implications for Policy and Practice',
						fr_CA: '',
					},
					galleys: [],
					id: 5,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 10,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 4,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Computer Skill Requirements for New and Existing Teachers: Implications for Policy and Practice',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/4/version/5',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [],
			reviewRounds: [],
			stageId: 1,
			stageName: 'Submission',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/4',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/4',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/4',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/4',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/3',
			contextId: 1,
			currentPublicationId: 4,
			dateLastActivity: '2023-10-30 14:02:14',
			dateSubmitted: '2023-10-30 14:01:43',
			id: 3,
			lastModified: '2023-10-30 14:01:43',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/3/publications/4',
					authorsString: 'Catherine Kwantes (Author)',
					authorsStringIncludeInBrowse: 'Catherine Kwantes (Author)',
					authorsStringShort: 'Kwantes',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'The Facets Of Job Satisfaction: A Nine-Nation Comparative Study Of Construct Equivalence',
						fr_CA: '',
					},
					galleys: [],
					id: 4,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 9,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 3,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'The Facets Of Job Satisfaction: A Nine-Nation Comparative Study Of Construct Equivalence',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/3/version/4',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [
				{
					id: 4,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 3,
				},
				{
					id: 5,
					isCurrentUserAssigned: false,
					statusId: 0,
					status: 'Waiting for a response from the reviewer.',
					due: '2023-11-27',
					responseDue: '2023-11-27',
					round: 1,
					roundId: 3,
				},
			],
			reviewRounds: [
				{
					id: 3,
					round: 1,
					stageId: 3,
					statusId: 4,
					status: 'Submission accepted.',
				},
			],
			stageId: 4,
			stageName: 'Copyediting',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					statusId: 4,
					status: 'Submission accepted.',
					files: {
						count: 0,
					},
					currentUserCanRecommendOnly: false,
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/3',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/3',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/3',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/3',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/2',
			contextId: 1,
			currentPublicationId: 3,
			dateLastActivity: '2023-10-30 14:14:41',
			dateSubmitted: '2023-10-30 14:01:12',
			id: 2,
			lastModified: '2023-10-30 14:01:12',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/2/publications/3',
					authorsString: 'Carlo Corino (Author)',
					authorsStringIncludeInBrowse: 'Carlo Corino (Author)',
					authorsStringShort: 'Corino',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'The influence of lactation on the quantity and quality of cashmere production',
						fr_CA: '',
					},
					galleys: [],
					id: 3,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 8,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 2,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'The influence of lactation on the quantity and quality of cashmere production',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/2/version/3',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [],
			reviewRounds: [
				{
					id: 2,
					round: 1,
					stageId: 3,
					statusId: 14,
					status: 'All recommendations are in and a decision is needed.',
				},
			],
			stageId: 3,
			stageName: 'Review',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					statusId: 14,
					status: 'All recommendations are in and a decision is needed.',
					files: {
						count: 0,
					},
					currentUserCanRecommendOnly: false,
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/2',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/2',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/2',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/2',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/22',
			contextId: 1,
			currentPublicationId: 23,
			dateLastActivity: '2023-10-30 14:14:15',
			dateSubmitted: '2023-10-30 00:00:00',
			id: 22,
			lastModified: '2023-10-30 14:14:15',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/22/publications/23',
					authorsString: 'Zita Woods (Author)',
					authorsStringIncludeInBrowse: 'Zita Woods (Author)',
					authorsStringShort: 'Woods',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Finocchiaro: Arguments About Arguments',
						fr_CA: '',
					},
					galleys: [],
					id: 23,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 31,
					'pub-id::publisher-id': null,
					sectionId: 2,
					status: 1,
					submissionId: 22,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Finocchiaro: Arguments About Arguments',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/22/version/23',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [],
			reviewRounds: [],
			stageId: 4,
			stageName: 'Copyediting',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					statusId: 1,
					status: 'No editor has been assigned to this submission.',
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/22',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/22',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/22',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/22',
		},
		{
			_href:
				'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/21',
			contextId: 1,
			currentPublicationId: 22,
			dateLastActivity: '2023-10-30 14:14:15',
			dateSubmitted: '2023-10-30 00:00:00',
			id: 21,
			lastModified: '2023-10-30 14:14:15',
			publications: [
				{
					_href:
						'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/21/publications/22',
					authorsString: 'Catalin Fraser (Author)',
					authorsStringIncludeInBrowse: 'Catalin Fraser (Author)',
					authorsStringShort: 'Fraser',
					categoryIds: [],
					coverImage: {
						en: null,
						fr_CA: null,
					},
					'crossrefplugin::registeredDoi': null,
					'crossrefplugin::status': null,
					crossrefplugin_batchId: null,
					crossrefplugin_failedMsg: null,
					crossrefplugin_successMsg: null,
					datePublished: null,
					doiObject: null,
					fullTitle: {
						en: 'Test submission wizard with categories',
						fr_CA: '',
					},
					galleys: [],
					id: 22,
					locale: 'en',
					pages: null,
					prefix: {
						en: '',
						fr_CA: '',
					},
					primaryContactId: 30,
					'pub-id::publisher-id': null,
					sectionId: 1,
					status: 1,
					submissionId: 21,
					subtitle: {
						en: '',
						fr_CA: '',
					},
					title: {
						en: 'Test submission wizard with categories',
						fr_CA: '',
					},
					urlPublished:
						'http://localhost:7002/index.php/publicknowledge/article/view/21/version/22',

					versionStage: 'AO',
					versionMajor: 1,
					versionMinor: 0,
					versionString: 'Author Original 1.0',
				},
			],
			reviewAssignments: [],
			reviewRounds: [],
			stageId: 1,
			stageName: 'Submission',
			stages: [
				{
					id: 1,
					label: 'Submission',
					isActiveStage: true,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					statusId: 1,
					status: 'No editor has been assigned to this submission.',
					files: {
						count: 0,
					},
				},
				{
					id: 3,
					label: 'Review',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 4,
					label: 'Copyediting',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
				{
					id: 5,
					label: 'Production',
					isActiveStage: false,
					openQueryCount: 0,
					currentUserAssignedRoles: [],
					files: {
						count: 0,
					},
				},
			],
			status: 1,
			statusLabel: 'Queued',
			submissionProgress: '',
			urlAuthorWorkflow:
				'http://localhost:7002/index.php/publicknowledge/authorDashboard/submission/21',
			urlEditorialWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/21',
			urlPublished:
				'http://localhost:7002/index.php/publicknowledge/article/view/21',
			urlWorkflow:
				'http://localhost:7002/index.php/publicknowledge/workflow/access/21',
		},
	],
};
