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
			const originalItem = this.items.find((item) => item.id === mappedItem.id);

			originalItem.publications.forEach((publication) => {
				const isCurrentVersion =
					publication.id === this.getCurrentPublication(originalItem).id;
				const versionNumber = publication.version;

				// Submissions
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
							uid: `${originalItem.id}-monograph-${publication.id}`,
							displayType: this.__('submission.monograph'),
							type: 'publication',
							isCurrentVersion,
							versionNumber,
							updateWithNewDoiEndpoint,
						})
					);
				}

				if (this.enabledDoiTypes.includes('chapter')) {
					publication.chapters.forEach((chapter) => {
						let doiObject = chapter.doiObject;

						let updateWithNewDoiEndpoint = `${this.doiApiUrl}/chapters/${chapter.id}`;
						updateWithNewDoiEndpoint = updateWithNewDoiEndpoint.replace(
							/dois/g,
							'_dois'
						);

						newMappedItem.doiObjects.push(
							this.mapDoiObject(doiObject, {
								id: chapter.id,
								uid: `${originalItem.id}-chapter-${chapter.id}`,
								displayType: this.localize(chapter.title),
								type: 'chapter',
								isCurrentVersion,
								versionNumber,
								updateWithNewDoiEndpoint,
							})
						);
					});
				}

				// Publication Formats
				if (this.enabledDoiTypes.includes('representation')) {
					publication.publicationFormats.forEach((publicationFormat) => {
						let doiObject = publicationFormat.doiObject;

						let updateWithNewDoiEndpoint = `${this.doiApiUrl}/publicationFormats/${publicationFormat.id}`;
						updateWithNewDoiEndpoint = updateWithNewDoiEndpoint.replace(
							/dois/g,
							'_dois'
						);

						newMappedItem.doiObjects.push(
							this.mapDoiObject(doiObject, {
								id: publicationFormat.id,
								uid: `${originalItem.id}-representation-${publicationFormat.id}`,
								displayType: this.__('manager.dois.formatIdentifier.file', {
									format: this.localize(publicationFormat.name),
								}),
								type: 'representation',
								isCurrentVersion,
								versionNumber,
								updateWithNewDoiEndpoint: updateWithNewDoiEndpoint,
							})
						);
					});
				}

				// Submission files
				if (this.enabledDoiTypes.includes('file')) {
					publication.publicationFormats.forEach((publicationFormat) => {
						publicationFormat.submissionFiles.forEach((submissionFile) => {
							let doiObject = submissionFile.doiObject;

							let updateWithNewDoiEndpoint = `${this.doiApiUrl}/submissionFiles/${submissionFile.id}`;
							updateWithNewDoiEndpoint = updateWithNewDoiEndpoint.replace(
								/dois/g,
								'_dois'
							);

							newMappedItem.doiObjects.push(
								this.mapDoiObject(doiObject, {
									id: submissionFile.id,
									uid: `${originalItem.id}-file-${submissionFile.id}`,
									displayType: `${this.localize(
										publicationFormat.name
									)} / ${this.localize(submissionFile.name)}`,
									type: 'file',
									isCurrentVersion,
									versionNumber,
									updateWithNewDoiEndpoint: updateWithNewDoiEndpoint,
								})
							);
						});
					});
				}
			});
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
