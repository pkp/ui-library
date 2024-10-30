<template>
	<div class="selectSubmissionFileListItem">
		<label class="selectSubmissionFileListItem__label">
			<div class="selectSubmissionFileListItem__selector">
				<slot />
			</div>
			<File
				:id="describedById"
				class="selectSubmissionFileListItem__file"
				:document-type="documentType"
				:file-id="fileId"
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
			<Badge v-if="genreName" :is-primary="genreIsPrimary">
				{{ genreName }}
			</Badge>
			<PkpButton
				v-if="url"
				class="selectSubmissionFileListItem__download"
				element="a"
				:href="url"
				target="_blank"
				rel="noopener noreferrer"
				:aria-describedby="describedById"
			>
				<Icon icon="Download" class="h-4 w-4" />
				<span class="-screenReader">{{ downloadLabel }}</span>
			</PkpButton>
		</div>
	</div>
</template>

<script>
import Badge from '@/components/Badge/Badge.vue';
import PkpButton from '@/components/Button/Button.vue';
import Icon from '@/components/Icon/Icon.vue';

import File from '../../File/File.vue';

export default {
	components: {
		File,
		Badge,
		PkpButton,
		Icon,
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
				return this.t('common.uploadedByAndWhen', {
					name: this.uploadedBy,
					date: this.createdAt.substring(0, 10),
				});
			}
			return this.t('common.uploadedBy', {name: this.uploadedBy});
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
