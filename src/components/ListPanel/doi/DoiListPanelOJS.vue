<script>
import DoiListPanel from '@/components/ListPanel/doi/DoiListPanel';
export default {
	name: 'DoiListPanelOJS',
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

			// Submissions
			if (this.itemType === 'submission') {
				originalItem.publications.forEach((publication) => {
					const isCurrentVersion =
						publication.id === this.getCurrentPublication(originalItem).id;
					const versionNumber = publication.version;

					if (this.enabledDoiTypes.includes('publication')) {
						let doiObject = publication.doiObject;

						let updateWithNewDoiEndpoint = `${this.doiApiUrl}/publications/${originalItem.currentPublicationId}`;
						updateWithNewDoiEndpoint = updateWithNewDoiEndpoint.replace(
							/dois/g,
							'_dois'
						);

						newMappedItem.doiObjects.push(
							this.mapDoiObject(doiObject, {
								id: publication.id,
								uid: `${originalItem.id}-article-${publication.id}`,
								displayType: this.__('article.article'),
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
			} else if (this.itemType === 'issue') {
				if (this.enabledDoiTypes.includes('issue')) {
					let doiObject = originalItem.doiObject;

					let updateWithNewDoiEndpoint = `${this.doiApiUrl}/issues/${originalItem.id}`;
					updateWithNewDoiEndpoint = updateWithNewDoiEndpoint.replace(
						/dois/g,
						'_dois'
					);

					newMappedItem.doiObjects.push(
						this.mapDoiObject(doiObject, {
							id: originalItem.id,
							uid: `${originalItem.id}-issue`,
							displayType: this.__('issue.issue'),
							type: 'issue',
							isCurrentVersion: true,
							versionNumber: 1,
							updateWithNewDoiEndpoint,
						})
					);
				}
			}

			return newMappedItem;
		},
		/**
		 * Gets the title to be used in mapped object with app-specific implementation.
		 *
		 * @param {Object} item Item being mapped
		 * @returns {String} title Title of the pubObject (used in DoiListItem)
		 */
		getItemTitle(item) {
			if (this.itemType === 'submission') {
				return this.getItemTitleBase(item);
			} else {
				return item.identification;
			}
		},
		/**
		 * Gets the pubObject's published URL—to be used in mapped object. App-specific implementation.
		 *
		 * @param {Object} item Item being mapped
		 * @returns {String} URL of the pubObject (used in DoiListItem)
		 */
		getUrlPublished(item) {
			if (this.itemType === 'submission') {
				return this.getUrlPublishedBase(item);
			} else {
				return item.publishedUrl;
			}
		},
		/**
		 * Gets the pubObject's publication status—to be used in mapped object. App-specific implementation.
		 *
		 * @param {Object} item Item being mapped
		 * @returns {Boolean} Publication status of pubObject
		 */
		getIsPublished(item) {
			if (this.itemType === 'submission') {
				return this.getIsPublishedBase(item);
			} else {
				return item.published;
			}
		},
	},
};
</script>
