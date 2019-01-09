<template>
	<div>
		<tabs>
			<tab name="First tab">
				<tabs :options="{ useUrlFragment: false }">
					<tab name="Tab A">
						<pkp-form v-bind="form" />
					</tab>
					<tab name="Tab B">
						Tab A content
					</tab>
					<tab name="Tab C">
						Tab A content
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
import FormUser from '@/docs/examples/Form/implementations/helpers/form-user';

export default {
	name: 'NestedTabsForm',
	components: {
		PkpForm,
	},
	data: function () {
		return {
			form: FormUser,
		};
	},
};
</script>
