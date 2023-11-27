<template>
	<tabs label="Demonstration of nested side tabs">
		<tab id="first" label="First tab">
			<tabs :is-side-tabs="true" label="Side tabs nested inside of a tab">
				<tab id="a" label="Tab A">Tab A content</tab>
				<tab id="b" label="Tab B With the Long Name">Tab B content</tab>
				<tab id="c" label="Tab C">Tab C content</tab>
			</tabs>
		</tab>
		<tab id="second" label="Second tab">Second tab content</tab>
		<tab id="third" label="Third tab">Third tab content</tab>
	</tabs>
</template>
