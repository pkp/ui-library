<template>
	<div class="previewModal">
		<pkp-button ref="modalFormButton" @click="$modal.show('form')">
			Modal with Form
		</pkp-button>
		<modal
			v-bind="MODAL_PROPS"
			name="form"
			@closed="setFocusToRef('modalFormButton')"
		>
			<modal-content
				closeLabel="Close"
				modalName="form"
				title="Add Announcement"
			>
				<pkp-form v-bind="form" @set="setForm" @success="formSuccess" />
			</modal-content>
		</modal>
	</div>
</template>

<script>
import PkpForm from '@/components/Form/Form.vue';
import cloneDeep from 'clone-deep';
import form from '@/docs/components/Form/helpers/form-announcement';
import modal from '@/mixins/modal';

export default {
	mixins: [modal],
	components: {
		PkpForm
	},
	data() {
		return {
			form: {
				...cloneDeep(form),
				action: 'http://localhost:8080',
				method: 'GET'
			}
		};
	},
	methods: {
		formSuccess(r) {
			this.$modal.hide('form');
		},
		setForm(key, data) {
			let form = {...this.form};
			Object.keys(data).forEach(function(key) {
				form[key] = data[key];
			});
			this.form = form;
		}
	}
};
</script>
