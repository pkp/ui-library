export const PublicationConfig = {
	titleAbstract: {
		getPrimaryItems: ({submission, selectedPublication, pageInitConfig}) => {
			return [
				{
					component: 'PublicationTitleAbstractForm',
					props: {
						form: pageInitConfig.publicationTitleAbstractForm,
						sections: pageInitConfig.sections,
						submission,
						publication: selectedPublication,
					},
				},
			];
		},
	},
	metadata: {
		getPrimaryItems: ({submission, selectedPublication, pageInitConfig}) => {
			return [
				{
					component: 'PublicationTitleAbstractForm',
					props: {
						form: pageInitConfig.publicationMetadataForm,
						submission,
						publication: selectedPublication,
					},
				},
			];
		},
	},
	citations: {
		getPrimaryItems: ({submission, selectedPublication, pageInitConfig}) => {
			return [
				{
					component: 'PublicationTitleAbstractForm',
					props: {
						form: pageInitConfig.publicationCitationsForm,
						sections: pageInitConfig.sections,
						submission,
						publication: selectedPublication,
					},
				},
			];
		},
	},
};

export function useEditorPublicationConfig() {
	function getPrimaryItems(args) {
		return PublicationConfig[args.selectedPublicationMenu].getPrimaryItems(
			args,
		);
	}

	return {getPrimaryItems};
}
