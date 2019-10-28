<template>
	<tabs label="Default demo of tabs component">
		<tab label="First tab" id="first" badge="12">
			First tab content
		</tab>
		<tab label="Second tab" id="second" badge="2">
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
