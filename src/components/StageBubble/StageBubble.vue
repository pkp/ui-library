<template>
	<span class="stageBubble">
		<span
			class="stageBubble__bubble"
			:class="'stageBubble__bubble--' + stageClassFragment"
			aria-hidden="true"
		/>
		<span class="stageBubble__slot">
			<slot />
		</span>
	</span>
</template>

<script>
const stageMap = {
	1: 'submission',
	2: 'review',
	3: 'review',
	4: 'copyediting',
	5: 'production',
};

export default {
	props: {
		stageId: {
			type: Number,
			required: true,
			validator: function (value) {
				return Object.keys(stageMap).includes(value.toString());
			},
		},
	},
	computed: {
		stageClassFragment() {
			return stageMap[this.stageId];
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.stageBubble {
	display: flex;
	width: auto;
	gap: 0 0.5em;
	align-items: center;
}

.stageBubble__bubble {
	width: 1.5em;
	height: 1.5em;
	background: @bg-anchor;
	border-radius: 50%;
}

.stageBubble__bubble--submission {
	background: @submission;
}
.stageBubble__bubble--review {
	background: @review;
}
.stageBubble__bubble--copyediting {
	background: @copyediting;
}
.stageBubble__bubble--production {
	background: @production;
}

.stageBubble__slot {
	white-space: nowrap;
}
</style>
