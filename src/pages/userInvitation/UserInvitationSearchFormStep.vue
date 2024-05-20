<template>
	<field-text
		:label="t('user.email')"
		:value="fields.email"
		name="email"
		size="large"
		@change="updateField"
	/>
	<br />
	<p>or</p>
	<br />
	<field-text
		:label="t('user.username')"
		:value="fields.username"
		name="username"
		size="large"
		@change="updateField"
	/>
	<br />
	<p>or</p>
	<br />
	<field-text
		:label="t('user.orcid')"
		:value="fields.orcid"
		name="orcid"
		size="large"
		@change="updateField"
	/>
</template>

<script setup>
import {defineProps, ref, computed} from 'vue';
import FieldText from '@/components/Form/fields/FieldText.vue';
import {useUserInvitationPageStore} from './UserInvitationPageStore';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
defineProps({
	section: {
		type: Object,
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
		} else {
			// TODO: add back error handling
			/*errors.value = {
				error: t('invitation.noUserFound'),
			};*/
			// TODO: update field which has some value
			store.updatePayload('email', fields.value.email);
		}
	} else {
		// TODO: add back error handling
		/*errors.value = {
			error: t('invitation.emptySearchFields'),
		};*/
	}
	return true;
}
</script>
