<template>
	<p>{{ message }}</p>
	<div>
		<ul>
			<li>{{ t('user.email') }} : {{ email }}</li>
			<li>{{ t('userInvitation.roleTable.role') }} : {{ roles }}</li>
			<li>{{ t('common.status') }} : {{ status }}</li>
			<li>{{ t('user.affiliation') }} : {{ affiliation }}</li>
		</ul>
	</div>
</template>

<script setup>
import {useTranslation} from '@/composables/useTranslation';

defineProps({
	message: {type: String, required: true},
	email: {type: String, required: true},
	roles: {type: String, required: true},
	status: {type: String, required: true},
	affiliation: {type: String, required: true},
});

const {t} = useTranslation();
</script>
