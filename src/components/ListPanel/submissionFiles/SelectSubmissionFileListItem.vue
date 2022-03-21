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
		<div v-if="genreName || url" class="listPanel__itemActions">
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
		File
	},
	props: {
		documentType: {
			type: String,
			default() {
				return '';
			}
		},
		downloadLabel: {
			type: String,
			required: true
		},
		genreName: {
			type: String,
			default() {
				return '';
			}
		},
		genreIsPrimary: {
			type: Boolean,
			default() {
				return false;
			}
		},
		fileId: {
			type: Number,
			default() {
				return 0;
			}
		},
		name: {
			type: String,
			required: true
		},
		url: {
			type: String,
			default() {
				return '';
			}
		}
	},
	data() {
		return {
			describedById: ''
		};
	},
	created() {
		this.describedById = $.pkp.classes.Helper.uuid();
	}
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
	position: relative;
	top: -2px; // vertical alignment
	width: 3rem;
	min-width: 3rem;
	margin-left: -1rem;

	input {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
}

.selectSubmissionFileListItem__download {
	text-align: center;
}
</style>
