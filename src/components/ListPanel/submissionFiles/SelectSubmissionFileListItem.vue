<template>
	<div class="selectSubmissionFileListItem">
		<label class="selectSubmissionFileListItem__label">
			<div class="selectSubmissionFileListItem__selector">
				<slot />
			</div>
			<file
				class="selectSubmissionFileListItem__file"
				:documentType="documentType"
				:fileId="fileId"
				:id="describedById"
				:name="name"
			/>
		</label>
		<div
			v-if="uploadedDetails || genreName || url"
			class="listPanel__itemActions"
		>
			<span v-if="uploadedDetails">
				{{ uploadedDetails }}
			</span>
			<badge v-if="genreName" :is-primary="genreIsPrimary">
				{{ genreName }}
			</badge>
			<pkp-button
				v-if="url"
				class="selectSubmissionFileListItem__download"
				element="a"
				:href="url"
				target="_blank"
				rel="noopener noreferrer"
				:aria-describedby="describedById"
			>
				<icon icon="download" />
				<span class="-screenReader">{{ downloadLabel }}</span>
			</pkp-button>
		</div>
	</div>
</template>

<script>
import File from '../../File/File.vue';

export default {
	components: {
		File,
	},
	props: {
		createdAt: {
			type: String,
			default() {
				return '';
			},
		},
		documentType: {
			type: String,
			default() {
				return '';
			},
		},
		downloadLabel: {
			type: String,
			required: true,
		},
		genreName: {
			type: String,
			default() {
				return '';
			},
		},
		genreIsPrimary: {
			type: Boolean,
			default() {
				return false;
			},
		},
		fileId: {
			type: Number,
			default() {
				return 0;
			},
		},
		name: {
			type: String,
			required: true,
		},
		uploadedBy: {
			type: String,
			default() {
				return '';
			},
		},
		url: {
			type: String,
			default() {
				return '';
			},
		},
	},
	data() {
		return {
			describedById: '',
		};
	},
	computed: {
		uploadedDetails() {
			if (!this.uploadedBy) {
				return '';
			}
			if (this.createdAt) {
				return this.__('common.uploadedByAndWhen', {
					name: this.uploadedBy,
					date: this.createdAt.substring(0, 10),
				});
			}
			return this.__('common.uploaded');
		},
	},
	created() {
		this.describedById = $.pkp.classes.Helper.uuid();
	},
};
</script>

<style lang="less">
@import '../../../styles/_import';

.selectSubmissionFileListItem {
	display: flex;
	align-items: center;
}

.selectSubmissionFileListItem__label {
	display: flex;
	align-items: center;
	overflow: hidden;
	padding: 0 0.5rem;
	margin: -0.5rem;
}

.selectSubmissionFileListItem__selector {
	width: 3rem;
	text-align: center;
	flex-shrink: 0;
}

.selectSubmissionFileListItem__download {
	text-align: center;
}
</style>
