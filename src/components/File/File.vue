<template>
	<div class="file">
		<icon :icon="documentTypeIcon" :inline="true" class="file__documentType" />
		<span v-if="fileId" class="file__id">
			{{ fileId }}
		</span>
		{{ name }}
	</div>
</template>

<script>
export default {
	props: {
		documentType: {
			type: String,
			default() {
				return '';
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
		}
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
		}
	}
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
