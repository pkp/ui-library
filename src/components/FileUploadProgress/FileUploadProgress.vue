<template>
	<div class="fileUploadProgress">
		<div class="fileUploadProgress__row">
			<div class="fileUploadProgress__name" :id="uuid">
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
		ProgressBar
	},
	props: {
		cancelUploadLabel: {
			type: String,
			required: true
		},
		errors: {
			type: Array,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		progress: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			uuid: ''
		};
	},
	created() {
		this.uuid = $.pkp.classes.Helper.uuid();
	}
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
	margin-left: auto;
}

.fileUploadProgress .progressBar {
	margin-top: 0.75rem;
	margin-bottom: 0.75rem;
}
</style>
