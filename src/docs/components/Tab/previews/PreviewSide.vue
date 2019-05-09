<template>
	<tabs>
		<tab name="First tab">
			<tabs :options="{ useUrlFragment: false }" class="tabs-component--side">
				<tab name="Tab A">
					Tab A content
				</tab>
				<tab name="Tab B With the Long Name">
					Tab B content
				</tab>
				<tab name="Tab C">
					Tab C content
				</tab>
			</tabs>
		</tab>
		<tab name="Second tab">
			Second tab content
		</tab>
		<tab name="Third tab">
			Third tab content
		</tab>
	</tabs>
</template>
