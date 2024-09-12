const CommonDefaults = {
	id: 10,
	round: 1,
	stageId: pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
	statusId: pkp.const.REVIEW_ROUND_STATUS_PENDING_REVIEWERS,
};

export function getReviewRoundMock(overrides = {}) {
	return {...CommonDefaults, ...overrides};
}
