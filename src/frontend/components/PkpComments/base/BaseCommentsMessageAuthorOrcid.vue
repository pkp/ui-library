<template>
	<a
		v-if="messageProps.message.userOrcidDisplayValue"
		class="BaseCommentsMessageAuthorOrcid"
		:href="messageProps.message.userOrcidDisplayValue"
	>
		<PkpIcon
			:icon="
				messageProps.message.isUserOrcidAuthenticated
					? 'Orcid'
					: 'OrcidUnauthenticated'
			"
		/>
		{{ messageProps.message.userOrcidDisplayValue }}
	</a>
</template>
<script setup>
import {inject} from 'vue';

const messageProps = inject('messageProps');
</script>
