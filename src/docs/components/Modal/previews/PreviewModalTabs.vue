<template>
	<div class="previewModal">
		<pkp-button ref="modalTabsButton" @click="$modal.show('tabs')">
			Modal with Tabs
		</pkp-button>
		<modal
			closeLabel="Close"
			name="tabs"
			title="Nested Tabs Example"
			@closed="setFocusToRef('modalTabsButton')"
		>
			<p>
				Avoid complex interactions in modals whenever possible. Deeply nested
				tabs like this are often a sign that a single modal is trying to do too
				much. If there is more than one task that can be completed in a modal,
				it is usually better to use a different UI pattern.
			</p>
			<tabs>
				<tab id="one" label="First Tab">
					<tabs>
						<tab id="nestedone" label="First nested">
							Lorem ipsum dolor sit amet
						</tab>
						<tab id="nestedtwo" label="Second nested">
							Amet sit dolor ipsum Lorem
						</tab>
						<tab id="nestedthree" label="Third nested">
							Dolor ipsum sit lorem amet
						</tab>
					</tabs>
				</tab>
				<tab id="two" label="Second Tab">
					This is the second tab.
				</tab>
				<tab id="three" label="Third Tab">
					This is the third tab.
				</tab>
			</tabs>
			<template slot="footer">
				<pkp-button @click="$modal.hide('tabs')">Close</pkp-button>
			</template>
		</modal>
	</div>
</template>

<script>
import Modal from '@/components/Modal/Modal.vue';

export default {
	components: {
		Modal
	}
};
</script>
