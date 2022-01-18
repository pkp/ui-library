<template>
	<div class="fileAttacherReviewFiles">
		<div v-if="!files.length" class="fileAttacherReviewFiles__noFiles">
			{{ __('common.noItemsFound') }}
		</div>
		<div v-else class="fileAttacherReviewFiles__files">
			<div
				v-for="(file, i) in files"
				:key="i"
				class="fileAttacherReviewFiles__file"
			>
				<label class="fileAttacherReviewFiles__file__label">
					<input type="checkbox" :value="file.id" v-model="selected" />
					<file
						:id="'FileAttacherReviewFiles__UploadedFile__' + i"
						:fileId="file.id"
						:name="file.reviewerName + ' — ' + localize(file.name)"
						:documentType="file.documentType"
					/>
				</label>
				<pkp-button
					class="fileAttacherReviewFiles__download"
					element="a"
					:href="file.url"
					target="_blank"
					rel="noopener noreferrer"
					:aria-describedby="'FileAttacherReviewFiles__UploadedFile__' + i"
				>
					<icon icon="download" />
					<span class="-screenReader">{{ downloadLabel }}</span>
				</pkp-button>
			</div>
		</div>
		<div class="fileAttacher__footer">
			<button class="fileAttacher__back -linkButton" @click="$emit('cancel')">
				<icon icon="long-arrow-left" :inline="true" />
				Back
			</button>
			<pkp-button
				:isPrimary="true"
				:isDisabled="!selected.length"
				@click="$emit('selected:files', selectedFiles)"
			>
				Attach Files
			</pkp-button>
		</div>
	</div>
</template>

<script>
import File from '@/components/File/File.vue';

export default {
	name: 'FileAttacherReviewFiles',
	components: {
		File
	},
	props: {
		component: {
			type: String,
			required: true
		},
		downloadLabel: {
			type: String,
			required: true
		},
		files: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			selected: []
		};
	},
	computed: {
		selectedFiles() {
			return this.files.filter(file => this.selected.includes(file.id));
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.fileAttacherReviewFiles__noFiles {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 4rem;
	font-size: @font-sml;
}

.fileAttacherReviewFiles__files {
	padding: 0.5rem 0;
}

.fileAttacherReviewFiles__file {
	display: flex;
	align-items: center;
	padding: 0.5rem 0;
}

.fileAttacherReviewFiles__file__label {
	display: flex;
	align-items: center;
	overflow: hidden;

	.file {
		margin-left: 1rem;
	}
}

.fileAttacherReviewFiles__download {
	margin-left: auto;
	text-align: center;
}
</style>
