/**
 * Provides functions for working with participant roles
 */
export function useParticipant() {
	/**
	 * Get the role IDs that correspond to editorial roles
	 * @returns {Array<number>} Array of role IDs for editorial roles
	 */
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
