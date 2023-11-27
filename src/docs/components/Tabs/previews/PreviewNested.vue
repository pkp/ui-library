<template>
	<tabs label="Tabs that include another set of tabs">
		<tab id="first" label="First tab">
			<tabs label="Tabs nested inside of a tab">
				<tab id="A" label="Tab A">Tab A Content</tab>
				<tab id="B" label="Tab B">Tab B content</tab>
				<tab id="C" label="Tab C">Tab C content</tab>
			</tabs>
		</tab>
		<tab id="second" label="Second tab">Second tab content</tab>
		<tab id="third" label="Third tab">Third tab content</tab>
	</tabs>
</template>
