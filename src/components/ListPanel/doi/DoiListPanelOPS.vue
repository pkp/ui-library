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
			const originalItem = this.items.find(item => item.id === mappedItem.id);

			// Submissions
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
					uid: `${originalItem.id}-preprint-${
						this.getCurrentPublication(originalItem).id
					}`,
					displayType: 'Preprint',
					type: 'preprint',
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
							: doiObject[this.registrationAgencyInfo['registeredMessageKey']],
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

			return mappedItem;
		}
	}
};
</script>
