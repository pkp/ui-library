<template>
	<div>
		<pkp-button
			:element="element"
			:href="href"
			:label="label"
			:icon="icon"
			:isPrimary="isPrimary"
			:isWarnable="isWarnable"
			:isActive="isActive"
			:isLink="isLink"
		/>
	</div>
</template>

<script>
import PkpButton from '@/components/Button/Button.vue';

export default {
	name: 'ViewButton',
	components: {
		PkpButton,
	},
	data: function () {
		return {
			element: 'button',
			href: '',
			label: 'Submit',
			icon: '',
			isPrimary: false,
			isWarnable: false,
			isActive: false,
			isLink: false,
		};
	},
};
</script>
