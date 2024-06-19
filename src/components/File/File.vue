<template>
	<div class="flex items-center">
		<icon :icon="documentTypeIcon" class="h-6 w-6 flex-none text-heading" />
		<span v-if="fileId" class="file__id">
			{{ fileId }}
		</span>
		<span class="ms-2 truncate text-base-normal text-default">
			<a v-if="url" class="hover:underline" :href="url" target="_blank">
				{{ name }}
			</a>
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
				: 'DocumentDefault';
		},
	},
};
</script>
