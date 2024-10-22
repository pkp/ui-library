<template>
	<div class="space-y-4 p-8">
		<FieldText
			:label="t('about.contact.email')"
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
import {useTranslation} from '@/composables/useTranslation';

defineProps({
	validateFields: {
		type: Array,
		default() {
			return null;
		},
	},
});

const store = useUserInvitationPageStore();
const {t} = useTranslation();
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
		const {apiUrl} = useUrl('users');

		const {data: userData, fetch} = useFetch(apiUrl, {
			query: {searchPhrase: searchPhrase.value, status: 'all'},
		});
		await fetch();
		if (userData.value.items.length > 0) {
			let user = {};
			if (userData.value.items.length > 1 && fields.value.username.length > 0) {
				user = userData.value.items.find(
					(value) => value.userName === fields.value.username,
				);
				if (!user) {
					store.updatePayload('inviteeEmail', fields.value.email);
					store.userSearch.message = t('userInvitation.search.userNotFound');
					store.userSearch.class = 'font-bold text-negative';
				} else {
					store.updatePayload('inviteeEmail', user.email);
					store.updatePayload('userId', user.id);
					store.updatePayload('givenName', user.givenName);
					store.updatePayload('familyName', user.familyName);
					store.updatePayload('orcid', user.orcid);
					store.updatePayload('currentUserGroups', user.groups);
					store.updatePayload('affiliation', user.affiliation);
					store.updatePayload('country', user.country);
					store.userSearch.message = t('userInvitation.search.userFound');
					store.userSearch.class = 'font-bold text-success';
				}
			} else {
				user = userData.value.items[0];
				store.updatePayload('inviteeEmail', user.email);
				store.updatePayload('userId', user.id);
				store.updatePayload('givenName', user.givenName);
				store.updatePayload('familyName', user.familyName);
				store.updatePayload('orcid', user.orcid);
				store.updatePayload('currentUserGroups', user.groups);
				store.updatePayload('affiliation', user.affiliation);
				store.updatePayload('country', user.country);
				store.userSearch.message = t('userInvitation.search.userFound');
				store.userSearch.class = 'font-bold text-success';
			}
		} else {
			store.updatePayload('inviteeEmail', fields.value.email);
			store.userSearch.message = t('userInvitation.search.userNotFound');
			store.userSearch.class = 'font-bold text-negative';
		}
		return true;
	} else {
		store.errors.error = t('invitation.searchForm.emptyError');
		return false;
	}
}
</script>
