<template>
	<div class="listPanel__item--submissionFile">
		<!-- Successfully uploaded and saved submission files -->
		<template v-if="item.fileId">
			<div class="listPanel__itemSummary">
				<div class="listPanel__itemIdentity">
					<div class="listPanel__itemSubtitle">
						<a
							class="listPanel__item--submissionFile__link"
							:href="item.url"
							:id="nameId"
						>
							<submission-files-file
								:documentType="item.documentType"
								:name="localize(item.name)"
							/>
						</a>
					</div>
				</div>
				<div class="listPanel__itemActions">
					<badge
						v-if="item.genre"
						:is-primary="isPrimaryGenre"
						class="listPanel--submissionFiles__itemGenre"
					>
						{{ item.genre.name }}
					</badge>
					<pkp-button
						:id="editId"
						:aria-describedby="nameId"
						@click="$emit('edit', item)"
					>
						{{ __('common.edit') }}
					</pkp-button>
					<pkp-button
						:is-warnable="true"
						:aria-describedby="nameId"
						@click="$emit('remove', item)"
					>
						{{ __('common.remove') }}
					</pkp-button>
				</div>
			</div>
			<div v-if="!item.genre" class="listPanel--submissionFiles__setGenre">
				<span role="alert">
					<icon icon="exclamation-triangle" :inline="true" />
					<span
						:id="genrePromptId"
						class="listPanel--submissionFiles__setGenreLabel"
					>
						{{ genrePromptLabel }}
					</span>
					<button
						v-for="genre in primaryGenres"
						:key="genre.id"
						class="-linkButton listPanel--submissionFiles__setGenreButton"
						:aria-describedby="genrePromptId + ' ' + nameId"
						@click="setGenre(genre.id)"
					>
						{{ genre.name }}
					</button>
					<button
						class="-linkButton listPanel--submissionFiles__setGenreButton"
						:aria-describedby="genrePromptId + ' ' + nameId"
						@click="$emit('edit', item)"
					>
						{{ otherLabel }}
					</button>
				</span>
				<template v-if="isSavingGenreId">
					<spinner class="listPanel--submissionFiles__genreSpinner" />
					<span
						class="-screenReader"
						role="status"
						aria-live="polite"
						aria-atomic="true"
					>
						{{ status }}
					</span>
				</template>
			</div>
		</template>

		<!-- Uploads in progress not yet saved as submission files -->
		<template v-else>
			<file-upload-progress
				:cancelUploadLabel="cancelUploadLabel"
				:errors="item.errors || []"
				:name="item.name"
				:progress="item.progress"
				@cancel="$emit('cancel', item.id)"
			/>
		</template>
	</div>
</template>

<script>
import Badge from '@/components/Badge/Badge.vue';
import FileUploadProgress from '@/components/FileUploadProgress/FileUploadProgress.vue';
import SubmissionFilesFile from '../../File/File.vue';

export default {
	components: {
		Badge,
		FileUploadProgress,
		SubmissionFilesFile
	},
	props: {
		apiUrl: {
			type: String,
			required: true
		},
		cancelUploadLabel: {
			type: String,
			required: true
		},
		genrePromptLabel: {
			type: String,
			required: true
		},
		genres: {
			type: Array,
			required: true
		},
		item: {
			type: Object,
			required: true
		},
		otherLabel: {
			type: String,
			required: true
		},
		stageId: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			isSavingGenreId: false,
			status: ''
		};
	},
	computed: {
		/**
		 * A computed id for the edit button
		 *
		 * @return {String}
		 */
		editId() {
			return this.compileId('edit');
		},

		/**
		 * Is this a primary file
		 */
		isPrimaryGenre() {
			return (
				this.genre && !this.genre.isDependent && !this.genre.isSupplementary
			);
		},

		/**
		 * A computed id to use in aria-describedby attributes
		 * for the prompt to choose a genre
		 *
		 * @return {String}
		 */
		genrePromptId() {
			return this.compileId('setGenre');
		},

		/**
		 * A computed id to use in aria-describedby attributes
		 * for buttons related to this file
		 *
		 * @return {String}
		 */
		nameId() {
			return this.compileId('name');
		},

		/**
		 * Genres for primary file components, such as the main article text,
		 * book manuscript or preprint.
		 *
		 * @return {Array}
		 */
		primaryGenres() {
			return this.genres.filter(genre => !!genre.isPrimary);
		}
	},
	methods: {
		/**
		 * Helper function to compile unique IDs for elements
		 *
		 * @param {String} type The type of ID you want to generate (eg - `tooltip`)
		 * @return {String}
		 */
		compileId(type) {
			const id = this.item.id || this.item.uuid;
			return [type, id].join('-');
		},

		/**
		 * Set the genreId for this item
		 *
		 * @param {Number} genreId The new genreId for the item
		 */
		setGenre(genreId) {
			this.isSavingGenreId = true;
			this.status = this.__('common.saving');
			var self = this;
			$.ajax({
				url: this.apiUrl + '/' + this.item.id + '?stageId=' + this.stageId,
				type: 'PUT',
				data: {
					genreId: genreId
				},
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken
				},
				error: this.ajaxErrorCallback,
				success(r) {
					self.status = self.__('form.saved');
					setTimeout(() => {
						self.$emit('update', r);
						self.$el.querySelector('#' + self.editId).focus();
					}, 500);
				},
				complete(r) {
					setTimeout(() => (self.isSavingGenreId = false), 500);
				}
			});
		}
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.listPanel--submissionFiles .listPanel__item {
	padding-top: 0.5rem;
	padding-bottom: 0.5rem;
}

.listPanel--submissionFiles .listPanel__itemSubtitle {
	overflow: visible;
}

.listPanel__item--submissionFile__link {
	display: block;
	margin-left: -0.25rem;
	padding: 0.25rem;
	border: 1px solid transparent;
	border-radius: @radius;
	color: @text;
	text-decoration: none;

	&:hover,
	&:focus {
		color: @text;
		border-color: @primary;
		outline: 0;
	}
}

.listPanel--submissionFiles__setGenre {
	font-size: 0.8rem;
	font-weight: @bold;
}

.listPanel--submissionFiles__setGenreLabel {
	font-size: 0.8rem;
}

.listPanel--submissionFiles__setGenreButton {
	margin-left: 0.5rem;
}

.listPanel--submissionFiles__itemGenre {
	margin-right: 0.25rem;
}

.listPanel--submissionFiles__genreSpinner {
	margin-left: 0.5rem;
}
</style>
