export function useParticipant() {
	function getEditorRoleIds() {
		return [
			pkp.const.ROLE_ID_MANAGER,
			pkp.const.ROLE_ID_SUB_EDITOR,
			pkp.const.ROLE_ID_ASSISTANT,
		];
	}

	function getUserAvatarInitialsFromName(fullName) {
		const fullNameParts = fullName.split(' ');

		return fullNameParts
			.map((part) => {
				const partTrimmed = part.trim();
				if (partTrimmed.length) {
					return partTrimmed[0].toUpperCase();
				}
				return '';
			})
			.join('')
			.substring(0, 3);
	}
	return {
		getUserAvatarInitialsFromName,
		getEditorRoleIds,
	};
}
