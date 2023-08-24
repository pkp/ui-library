<template>
	<div class="previewModal previewModal--side">
		<pkp-button ref="shortModalButton" @click="$modal.show('short')">
			Open Short Modal
		</pkp-button>
		<pkp-button ref="tallModalButton" @click="$modal.show('tall')">
			Open Tall Modal
		</pkp-button>
		<modal
			closeLabel="Close"
			name="short"
			type="side"
			@closed="setFocusToRef('shortModalButton')"
		>
			<template slot="header">
				<h2>Details</h2>
			</template>
			<panel>
				<panel-section v-html="pars[0]" />
			</panel>
		</modal>
		<modal
			closeLabel="Close"
			name="tall"
			type="side"
			@closed="setFocusToRef('tallModalButton')"
		>
			<template slot="header">
				<h2>Details</h2>
				<p>Some more text in the header.</p>
			</template>
			<panel>
				<panel-section v-for="(par, i) in pars" :key="i" v-html="par" />
			</panel>
		</modal>
	</div>
</template>

<script>
import Modal from '@/components/Modal/Modal.vue';
import publication from '../../../data/publication';

export default {
	components: {
		Modal,
	},
	data() {
		return {
			pars: [
				publication.abstract.en,
				publication.abstract.en,
				publication.abstract.en,
				publication.abstract.en,
				publication.abstract.en,
				publication.abstract.en,
				publication.abstract.en,
			],
		};
	},
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.previewModal--side {
	.modal__header {
		h2,
		p {
			margin: 0;
		}

		h2 {
			font-size: @font-base;
		}
	}
}
</style>
