<template>
	<tabs label="Demonstration of tabs with icon-only display">
		<tab icon="bell-o" label="First tab" id="first">
			First tab content
		</tab>
		<tab label="Second tab" id="second">
			Second tab content
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
