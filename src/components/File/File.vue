<template>
	<div class="file">
		<icon :icon="documentTypeIcon" :inline="true" class="file__documentType" />
		<span v-if="fileId" class="file__id">
			{{ fileId }}
		</span>
		<span class="ms-1">
			<a v-if="url" class="underline" :href="url" target="_blank">{{ name }}</a>
			<template v-else>
				{{ name }}
			</template>
		</span>
	</div>
</template>

<script>
export default {
	props: {
		/** Optional but recommended. Pass one of the `DOCUMENT_TYPE_` constants to show an icon that will match this document type. */
		documentType: {
			type: String,
			default() {
				return '';
			},
		},
		/** Optional. Show an ID with this file. See usage guidance below. */
		fileId: {
			type: Number,
			default() {
				return 0;
			},
		},
		/** Required. The file's name. */
		name: {
			type: String,
			required: true,
		},
		/** Optional. If the file should be be url to download file */
		url: {
			type: String,
			required: false,
			default() {
				return '';
			},
		},
	},
	computed: {
		/**
		 * The icon to match this document type
		 *
		 * @return {String}
		 */
		documentTypeIcon() {
			return !!pkp.documentTypeIcons &&
				!!pkp.documentTypeIcons[this.documentType]
				? pkp.documentTypeIcons[this.documentType]
				: 'file-o';
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.file {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: @font-sml;
}

.file__documentType {
	width: 1rem;
	text-align: center;
	font-size: 1rem;
	color: @primary;
}

.file__id {
	margin: 0 0.5rem;
	font-size: @font-tiny;
}
</style>
