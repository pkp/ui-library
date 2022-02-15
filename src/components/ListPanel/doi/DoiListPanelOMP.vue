<script>
import DoiListPanel from '@/components/ListPanel/doi/DoiListPanel';
export default {
	name: 'DoiListPanelOMP',
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

				/** @type {DoiObject} */
				const publicationItem = {
					id: this.getCurrentPublication(originalItem).id,
					doiId: doiObject === null ? null : doiObject.id,
					uid: `${originalItem.id}-monograph-${
						this.getCurrentPublication(originalItem).id
					}`,
					displayType: 'Monograph',
					type: 'monograph',
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
				};

				newMappedItem.doiObjects.push(publicationItem);
			}

			if (this.enabledDoiTypes.includes('chapter')) {
				this.getCurrentPublication(originalItem).chapters.forEach(chapter => {
					let doiObject = chapter.doiObject;

					let updateWithNewDoiEndpoint = `${this.doiApiUrl}/chapters/${chapter.id}`;
					updateWithNewDoiEndpoint = updateWithNewDoiEndpoint.replace(
						/dois/g,
						'_dois'
					);

					/** @type {DoiObject} */
					const chapterItem = {
						id: chapter.id,
						doiId: doiObject === null ? null : doiObject.id,
						uid: `${originalItem.id}-chapter-${chapter.id}`,
						displayType: this.localize(chapter.title),
						type: 'chapter',
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
					};

					newMappedItem.doiObjects.push(chapterItem);
				});
			}

			// Publication Formats
			if (this.enabledDoiTypes.includes('representation')) {
				this.getCurrentPublication(originalItem).publicationFormats.forEach(
					publicationFormat => {
						let doiObject = publicationFormat.doiObject;

						let updateWithNewDoiEndpoint = `${this.doiApiUrl}/publicationFormats/${publicationFormat.id}`;
						updateWithNewDoiEndpoint = updateWithNewDoiEndpoint.replace(
							/dois/g,
							'_dois'
						);

						/** @type {DoiObject} */
						const publicationFormatItem = {
							id: publicationFormat.id,
							doiId: doiObject === null ? null : doiObject.id,
							uid: `${originalItem.id}-publicationFormat-${publicationFormat.id}`,
							displayType: this.__('manager.dois.formatIdentifier.file', {
								format: this.localize(publicationFormat.name)
							}),
							type: 'publicationFormat',
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
						};
						newMappedItem.doiObjects.push(publicationFormatItem);
					}
				);
			}

			// Submission files
			if (this.enabledDoiTypes.includes('file')) {
				this.getCurrentPublication(originalItem).publicationFormats.forEach(
					publicationFormat => {
						publicationFormat.submissionFiles.forEach(submissionFile => {
							let doiObject = submissionFile.doiObject;

							let updateWithNewDoiEndpoint = `${this.doiApiUrl}/submissionFiles/${submissionFile.id}`;
							updateWithNewDoiEndpoint = updateWithNewDoiEndpoint.replace(
								/dois/g,
								'_dois'
							);

							/** @type {DoiObject} */
							const submissionFileItem = {
								id: submissionFile.id,
								doiId: doiObject === null ? null : doiObject.id,
								uid: `${originalItem.id}-submissionFile-${submissionFile.id}`,
								displayType: `${this.localize(
									publicationFormat.name
								)} / ${this.localize(submissionFile.name)}`,
								type: 'submissionFile',
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
							};
							newMappedItem.doiObjects.push(submissionFileItem);
						});
					}
				);
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
