<template>
	<tabs label="Tabs that include another set of tabs">
		<tab label="First tab" id="first">
			<tabs label="Tabs nested inside of a tab">
				<tab label="Tab A" id="A">
					Tab A Content
				</tab>
				<tab label="Tab B" id="B">
					Tab B content
				</tab>
				<tab label="Tab C" id="C">
					Tab C content
				</tab>
			</tabs>
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
