<template>
	<pkp-header :isOneLine="true">
		Data Modelling and Conceptual Modelling: a comparative analysis of
		functionality and roles within both wide and narrow scopes in a context of
		rapid synergistic iterative evolution
		<template slot="actions">
			<pkp-button label="Preview" />
			<pkp-button label="Activity Log" />
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
