<template>
	<tabs
		defaultTab="second"
		label="Demonstration of tabs with the middle tab opened by default"
	>
		<tab label="First tab" id="first">
			First tab content
		</tab>
		<tab label="Default tab" id="second">
			Default tab content displays first when opened
		</tab>
		<tab label="Third tab" id="third">
			Third tab content
		</tab>
	</tabs>
</template>

<script>
import Tab from '@/components/Tabs/Tab.vue';
import Tabs from '@/components/Tabs/Tabs.vue';

export default {
	components: {
		Tab,
		Tabs
	}
};
</script>
