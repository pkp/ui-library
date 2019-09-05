<template>
	<tabs label="Demonstration of nested side tabs">
		<tab label="First tab" id="first">
			<tabs :isSideTabs="true" label="Side tabs nested inside of a tab">
				<tab label="Tab A" id="a">
					Tab A content
				</tab>
				<tab label="Tab B With the Long Name" id="b">
					Tab B content
				</tab>
				<tab label="Tab C" id="c">
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
