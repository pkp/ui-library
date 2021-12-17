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
			const originalItem = this.items.find(item => item.id === mappedItem.id);

			// Submissions
			if (this.itemType === 'submission') {
				if (this.enabledDoiTypes.includes('publication')) {
					let doiObject = this.getCurrentPublication(originalItem).doiObject;

					let updateWithNewDoiEndpoint = `${this.doiApiUrl}/publications/${originalItem.currentPublicationId}`;
					updateWithNewDoiEndpoint = updateWithNewDoiEndpoint.replace(
						/dois/g,
						'_dois'
					);

					newMappedItem.doiObjects.push({
						id: this.getCurrentPublication(originalItem).id,
						doiId: doiObject === null ? null : doiObject.id,
						uid: `${originalItem.id}-article-${
							this.getCurrentPublication(originalItem).id
						}`,
						displayType: 'Article',
						type: 'article',
						identifier: doiObject === null ? '' : doiObject.doi,
						depositStatus:
							doiObject === null
								? pkp.const.DOI_STATUS_UNREGISTERED
								: doiObject.status,
						errorMessage:
							doiObject === null
								? null
								: doiObject[this.registrationAgencyInfo['errorMessageKey']],
						registeredMessage:
							doiObject === null
								? null
								: doiObject[
										this.registrationAgencyInfo['registeredMessageKey']
								  ],
						updateWithNewDoiEndpoint: updateWithNewDoiEndpoint
					});
				}

				// Galleys
				if (this.enabledDoiTypes.includes('representation')) {
					this.getCurrentPublication(originalItem).galleys.forEach(galley => {
						let doiObject = galley.doiObject;

						let updateWithNewDoiEndpoint = `${this.doiApiUrl}/galleys/${galley.id}`;
						updateWithNewDoiEndpoint = updateWithNewDoiEndpoint.replace(
							/dois/g,
							'_dois'
						);

						newMappedItem.doiObjects.push({
							id: galley.id,
							doiId: doiObject === null ? null : doiObject.id,
							uid: `${originalItem.id}-galley-${galley.id}`,
							displayType: galley.label,
							type: 'galley',
							identifier: doiObject === null ? '' : doiObject.doi,
							depositStatus:
								doiObject === null
									? pkp.const.DOI_STATUS_UNREGISTERED
									: doiObject.status,
							errorMessage:
								doiObject === null
									? null
									: doiObject[this.registrationAgencyInfo['errorMessageKey']],
							registeredMessage:
								doiObject === null
									? null
									: doiObject[
											this.registrationAgencyInfo['registeredMessageKey']
									  ],
							updateWithNewDoiEndpoint: updateWithNewDoiEndpoint
						});
					});
				}
			} else if (this.itemType === 'issue') {
				if (this.enabledDoiTypes.includes('issue')) {
					let doiObject = originalItem.doiObject;

					let updateWithNewDoiEndpoint = `${this.doiApiUrl}/issues/${originalItem.id}`;
					updateWithNewDoiEndpoint = updateWithNewDoiEndpoint.replace(
						/dois/g,
						'_dois'
					);

					newMappedItem.doiObjects.push({
						id: originalItem.id,
						doiId: doiObject === null ? null : doiObject.id,
						uid: `${originalItem.id}-issue`,
						displayType: 'Issue',
						type: 'issue',
						identifier: doiObject === null ? '' : doiObject.doi,
						depositStatus:
							doiObject === null
								? pkp.const.DOI_STATUS_UNREGISTERED
								: doiObject.status,
						errorMessage:
							doiObject === null
								? null
								: doiObject[this.registrationAgencyInfo['errorMessageKey']],
						registeredMessage:
							doiObject === null
								? null
								: doiObject[
										this.registrationAgencyInfo['registeredMessageKey']
								  ],
						updateWithNewDoiEndpoint: updateWithNewDoiEndpoint
					});
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
		}
	}
};
</script>
