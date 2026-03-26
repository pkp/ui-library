<template>
	<div>
		<div class="mx-auto max-w-md border border-light bg-secondary p-6">
			<h2 class="text-lg mb-3 text-center font-semibold text-primary">
				{{ t('user.confrimAccess') }}
			</h2>

			<p
				v-strip-unsafe-html="
					t('user.confrimAccess.description', {
						userFullName: getCurrentUserFullName(),
					})
				"
				class="text-sm text-gray-600 text-center leading-relaxed"
			></p>
		</div>

		<form
			:action="submitUrl"
			method="post"
			role="form"
			class="mx-auto mt-6 max-w-md space-y-4"
		>
			<FieldText
				label="Password"
				:is-required="true"
				name="password"
				input-type="password"
				size="large"
			/>

			<p v-if="error" class="text-sm mt-2 text-negative">{{ error }}</p>
			<FieldText :value="source" hidden name="source" />
			<FieldText :value="cancelUrl" hidden name="cancelUrl" />

			<div class="flex justify-between">
				<PkpButton
					type="button"
					class="mt-2"
					is-link
					element="a"
					:href="cancelUrl"
				>
					{{ t('common.cancel') }}
				</PkpButton>

				<PkpButton type="submit" class="mt-2" is-primary>
					{{ t('common.confirm') }}
				</PkpButton>
			</div>
		</form>
	</div>
</template>

<script setup>
import FieldText from '@/components/Form/fields/FieldText.vue';
import PkpButton from '@/components/Button/Button.vue';
import {useCurrentUser} from '@/composables/useCurrentUser';

const {getCurrentUserFullName} = useCurrentUser();
defineProps({
	/**
	 * The URL to redirect to after re-authentication.
	 */
	source: {
		type: String,
		required: true,
	},
	/**
	 * The URL to submit the form to.
	 */
	submitUrl: {
		type: String,
		required: true,
	},
	/**
	 * The URL to redirect to if the user cancels the re-authentication.
	 */
	cancelUrl: {
		type: String,
		required: true,
	},
	/**
	 * The error message to display.
	 */
	error: {
		type: String,
		required: false,
		default: () => '',
	},
});
</script>
