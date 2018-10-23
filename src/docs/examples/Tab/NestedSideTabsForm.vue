<template>
	<div>
		<tabs>
			<tab name="First tab">
				<tabs :options="{ useUrlFragment: false }" class="tabs-component--side">
					<tab name="Tab A">
						<pkp-form v-bind="form" />
					</tab>
					<tab name="Tab B">
						<pkp-form v-bind="form" />
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
	</div>
</template>

<script>
import PkpForm from '@/components/Form/Form';
import FormTest from '@/docs/examples/Form/implementations/helpers/form-test';

export default {
	name: 'NestedSideTabsForm',
	components: {
		PkpForm,
	},
	data: function () {
		return {
			form: FormTest,
		};
	},
};
</script>
