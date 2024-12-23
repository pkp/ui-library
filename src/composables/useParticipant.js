export function useParticipant() {
	function getEditorRoleIds() {
		return [
			pkp.const.ROLE_ID_MANAGER,
			pkp.const.ROLE_ID_SUB_EDITOR,
			pkp.const.ROLE_ID_ASSISTANT,
		];
	}

	return {
		getEditorRoleIds,
	};
}
