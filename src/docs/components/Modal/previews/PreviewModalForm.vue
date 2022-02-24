<template>
	<div class="previewModal">
		<pkp-button ref="modalFormButton" @click="$modal.show('form')">
			Modal with Form
		</pkp-button>
		<modal
			closeLabel="Close"
			name="form"
			title="Add Announcement"
			@closed="setFocusToRef('modalFormButton')"
		>
			<pkp-form v-bind="form" @set="setForm" @success="formSuccess" />
		</modal>
	</div>
</template>

<script>
import PkpForm from '@/components/Form/Form.vue';
import Modal from '@/components/Modal/Modal.vue';
import cloneDeep from 'clone-deep';
import form from '@/docs/components/Form/helpers/form-announcement';

export default {
	components: {
		PkpForm,
		Modal
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
