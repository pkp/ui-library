<template>
	<div class="previewModal">
		<pkp-button ref="modalTabsButton" @click="$modal.show('tabs')">
			Modal with Tabs
		</pkp-button>
		<modal
			v-bind="MODAL_PROPS"
			name="tabs"
			@closed="setFocusToRef('modalTabsButton')"
		>
			<modal-content
				closeLabel="Close"
				modalName="tabs"
				title="Nested Tabs Example"
			>
				<p>
					Avoid complex interactions in modals, such as deeply nested tabs like
					this, whenever possible. If there is more than one task that can be
					completed, it is usually better to use a different UI pattern.
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
				<div class="modal__footer">
					<pkp-button @click="$modal.hide('tabs')">Close</pkp-button>
				</div>
			</modal-content>
		</modal>
	</div>
</template>

<script>
import modal from '@/mixins/modal';

export default {
	mixins: [modal]
};
</script>
