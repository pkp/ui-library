<template>
	<pkp-header>
		Participants
		<template slot="actions">
			<pkp-button label="Send Message" />
			<pkp-button label="Add Participant" />
		</template>
	</pkp-header>
</template>

<script>
import PkpHeader from '@/components/Header/Header.vue';
import PkpButton from '@/components/Button/Button.vue';

export default {
	components: {
		PkpButton,
		PkpHeader
	}
};
</script>
