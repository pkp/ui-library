<template>
	<div class="space-y-4 p-8">
		<FieldText
			:label="t('userInvitation.searchField')"
			:value="fields.search"
			:description="t('userInvitation.searchField.description')"
			name="search"
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
import {useLocalize} from '@/composables/useLocalize';

defineProps({
	validateFields: {
		type: Array,
		default() {
			return null;
		},
	},
});

const store = useUserInvitationPageStore();
const {t} = useLocalize();
store.registerActionForStepId('searchUser', searchUser);

const fields = ref({search: ''});

function updateField(fieldName, b, fieldValue) {
	fields.value[fieldName] = fieldValue;
}

const searchPhrase = computed(() => {
	return fields.value.search.trim();
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
			user = userData.value.items.find(
				(value) => value.email === fields.value.search.trim(), // check provided email is exact match
			);
			user
				? user
				: (user = userData.value.items.find(
						(value) => value.userName === fields.value.search.trim(), // check provided username is exact match
					));
			user
				? user
				: (user = userData.value.items.find(
						(value) => value.orcid === fields.value.search.trim(), // check provided orcid is exact match
					));

			if (!user) {
				valid(fields.value.search.trim())
					? store.updatePayload('inviteeEmail', fields.value.search.trim())
					: '';
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
				store.updatePayload('disabled', user.disabled);
				store.userSearch.message = t('userInvitation.search.userFound');
				store.userSearch.class = 'font-bold text-success';
			}
		} else {
			valid(fields.value.search.trim())
				? store.updatePayload('inviteeEmail', fields.value.search.trim())
				: '';
			store.userSearch.message = t('userInvitation.search.userNotFound');
			store.userSearch.class = 'font-bold text-negative';
		}
		return true;
	} else {
		store.errors.error = t('invitation.searchForm.emptyError');
		return false;
	}

	function valid(email) {
		const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return pattern.test(email);
	}
}
</script>
