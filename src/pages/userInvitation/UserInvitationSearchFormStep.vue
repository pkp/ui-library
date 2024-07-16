<template>
	<div class="space-y-4 p-8">
		<FieldText
			:label="t('user.email')"
			:value="fields.email"
			:description="t('userInvitation.emailField.description')"
			name="email"
			size="large"
			@change="updateField"
		/>
		<p>or</p>
		<FieldText
			:label="t('user.username')"
			:value="fields.username"
			:description="t('userInvitation.usernameField.description')"
			name="username"
			size="large"
			@change="updateField"
		/>
		<p>or</p>
		<FieldText
			:label="t('user.orcid')"
			:value="fields.orcid"
			:description="t('userInvitation.orcidField.description')"
			name="orcid"
			size="large"
			@change="updateField"
		/>
	</div>
</template>

<script setup>
import {defineProps, ref, computed} from 'vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import {useUserInvitationPageStore} from './UserInvitationPageStore';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';

defineProps({
	validateFields: {
		type: Array,
		default() {
			return null;
		},
	},
});

const store = useUserInvitationPageStore();
store.registerActionForStepId('searchUser', searchUser);

const fields = ref({email: '', username: '', orcid: ''});

function updateField(fieldName, b, fieldValue) {
	fields.value[fieldName] = fieldValue;
}

const searchPhrase = computed(() => {
	let searchText = '';
	if (fields.value.email) {
		searchText = fields.value.email + ' ';
	}
	if (fields.value.orcid) {
		searchText = searchText + fields.value.orcid + ' ';
	}
	if (fields.value.username) {
		searchText = searchText + fields.value.username;
	}

	return searchText;
});

async function searchUser() {
	if (searchPhrase.value !== '') {
		const {apiUrl} = useUrl('_user');

		const {data: userData, fetch} = useFetch(apiUrl, {
			query: {searchPhrase: searchPhrase.value, status: 'all'},
		});
		await fetch();
		if (userData.value.items.length > 0) {
			const user = userData.value.items[0];
			store.updatePayload('email', user.email);
			store.updatePayload('userId', user.id);
			// we need to pass the givenName and familyName from API!!
			store.updatePayload('givenName', user.fullName.split(' ')[0]);
			store.updatePayload('familyName', user.fullName.split(' ')[1]);
			store.updatePayload('orcid', user.orcid);
			store.updatePayload('currentUserGroups', user.groups);
			store.updatePayload('affiliation', user.affiliation);
		} else {
			store.updatePayload('email', fields.value.email);
		}
		return true;
	} else {
		// TODO: add back error handling
		return false;
	}
}
</script>
