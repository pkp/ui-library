<template>
	<div class="fileUploadProgress">
		<div class="fileUploadProgress__row">
			<div :id="uuid" class="fileUploadProgress__name">
				{{ name }}
			</div>
			<div class="fileUploadProgress__actions">
				<pkp-button
					:is-warnable="true"
					:aria-describedby="uuid"
					@click="$emit('cancel')"
				>
					{{ cancelUploadLabel }}
				</pkp-button>
			</div>
		</div>
		<field-error v-if="errors.length" :messages="errors" />
		<progress-bar v-else :value="progress" />
	</div>
</template>

<script>
import FieldError from '@/components/Form/FieldError.vue';
import ProgressBar from '@/components/ProgressBar/ProgressBar.vue';

export default {
	components: {
		FieldError,
		ProgressBar,
	},
	props: {
		/** A localized string for the button to cancel the upload. */
		cancelUploadLabel: {
			type: String,
			required: true,
		},
		/** An array of error messages related to this upload. */
		errors: {
			type: Array,
			required: true,
		},
		/** The name of the file. */
		name: {
			type: String,
			required: true,
		},
		/** A number from `0-100` representing the percentage of the file that has been uploaded so far. */
		progress: {
			type: Number,
			required: true,
		},
	},
	emits: [
		/** Cancel the upload before it is finished. */
		'cancel',
	],
	data() {
		return {
			uuid: '',
		};
	},
	created() {
		this.uuid = $.pkp.classes.Helper.uuid();
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.fileUploadProgress__name {
	font-size: @font-sml;
}

.fileUploadProgress__row {
	display: flex;
	align-items: center;
}

.fileUploadProgress__actions {
	margin-inline-start: auto;
}

.fileUploadProgress .progressBar {
	margin-top: 0.75rem;
	margin-bottom: 0.75rem;
}
</style>
