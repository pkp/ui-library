import {expect, test, describe} from 'vitest';
import {useLegacyGridUrl} from './useLegacyGridUrl';

global.pkp = global.pkp || {};
global.pkp.context = {
	legacyGridBaseUrl:
		'http://mock/index.php/publicknowledge/$$$call$$$/component/action',
};

describe('useLegacyGridUrl', () => {
	test('grid.users.stageParticipant.StageParticipantGridHandler', () => {
		// http://localhost:7003/index.php/publicknowledge/$$$call$$$/grid/users/stage-participant/stage-participant-grid/add-participant?submissionId=13&stageId=3
		const {url} = useLegacyGridUrl({
			component: 'grid.users.stageParticipant.StageParticipantGridHandler',
			op: 'addParticipant',
			params: {submissionId: 13, stageId: 3},
		});

		expect(url.value).toBe(
			'http://mock/index.php/publicknowledge/$$$call$$$/grid/users/stage-participant/stage-participant-grid/add-participant?submissionId=13&stageId=3',
		);
	});

	test('grid.users.reviewer.ReviewerGridHandler', () => {
		const {url} = useLegacyGridUrl({
			component: 'grid.users.reviewer.ReviewerGridHandler',
			op: 'readReview',
			params: {submissionId: 13, reviewAssignmentId: 19, stageId: 3},
		});

		expect(url.value).toBe(
			'http://mock/index.php/publicknowledge/$$$call$$$/grid/users/reviewer/reviewer-grid/read-review?submissionId=13&reviewAssignmentId=19&stageId=3',
		);
	});

	test('modals.publish.AssignToIssueHandler', () => {
		const {url} = useLegacyGridUrl({
			component: 'modals.publish.AssignToIssueHandler',
			op: 'assign',
			params: {submissionId: 13, publicationId: 14},
		});

		expect(url.value).toBe(
			'http://mock/index.php/publicknowledge/$$$call$$$/modals/publish/assign-to-issue/assign?submissionId=13&publicationId=14',
		);
	});
});
