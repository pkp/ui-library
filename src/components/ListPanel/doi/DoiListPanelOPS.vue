<script>
import DoiListPanel from '@/components/ListPanel/doi/DoiListPanel';
export default {
	name: 'DoiListPanelOPS',
	extends: DoiListPanel,
	methods: {
		/**
		 * Adds doiObjects to mapped item with app-specific implementation.
		 *
		 * @param {Object} mappedItem Mapped item
		 * @returns {Object} Modified mapped item with doiObjects
		 */
		addDoiObjects(mappedItem) {
			let newMappedItem = mappedItem;
			const originalItem = this.items.find((item) => item.id === mappedItem.id);

			originalItem.publications.forEach((publication) => {
				const isCurrentVersion =
					publication.id === this.getCurrentPublication(originalItem).id;
				const versionNumber = publication.version;

				// Submissions
				if (this.enabledDoiTypes.includes('publication')) {
					const doiObject = publication.doiObject;

					let updateWithNewDoiEndpoint = `${this.doiApiUrl}/publications/${publication.id}`;
					updateWithNewDoiEndpoint = updateWithNewDoiEndpoint.replace(
						/dois/g,
						'_dois'
					);

					newMappedItem.doiObjects.push(
						this.mapDoiObject(doiObject, {
							id: publication.id,
							uid: `${originalItem.id}-publication-${publication.id}`,
							displayType: this.__('submission.publication'),
							type: 'publication',
							isCurrentVersion,
							versionNumber,
							updateWithNewDoiEndpoint,
						})
					);
				}

				// Galleys
				if (this.enabledDoiTypes.includes('representation')) {
					publication.galleys.forEach((galley) => {
						const doiObject = galley.doiObject;

						let updateWithNewDoiEndpoint = `${this.doiApiUrl}/galleys/${galley.id}`;
						updateWithNewDoiEndpoint = updateWithNewDoiEndpoint.replace(
							/dois/g,
							'_dois'
						);

						newMappedItem.doiObjects.push(
							this.mapDoiObject(doiObject, {
								id: galley.id,
								uid: `${originalItem.id}-representation-${galley.id}`,
								displayType: galley.label,
								type: 'representation',
								isCurrentVersion,
								versionNumber,
								updateWithNewDoiEndpoint,
							})
						);
					});
				}
			});

			return mappedItem;
		},
	},
};
</script>
