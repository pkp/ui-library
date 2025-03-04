<template>
	<p>{{ message }}</p>
	<div class="px-8">
		<ul role="list" class="list-disc">
			<li>
				<span class="text-xl-bold">{{ t('user.email') }}:</span>
				{{ email }}
			</li>
			<li>
				<span class="text-xl-bold">
					{{ t('userInvitation.roleTable.role') }}:
				</span>
				{{ roles }}
			</li>
			<li>
				<span class="text-xl-bold">{{ t('common.status') }}:</span>
				{{ status }}
			</li>
			<li>
				<span class="text-xl-bold">{{ t('user.affiliation') }}:</span>
				{{ affiliation }}
			</li>
		</ul>
	</div>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';

defineProps({
	message: {type: String, required: true},
	email: {type: String, required: true},
	roles: {type: String, required: true},
	status: {type: String, required: true},
	affiliation: {type: String, required: true},
});

const {t} = useLocalize();
</script>
