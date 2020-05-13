<template>
	<div class="previewIcon">
		<icon icon="bug" />
		<icon icon="info-circle" />
		<icon icon="exclamation-triangle" />
		<div class="previewIcon__inline">
			<icon icon="search" :inline="true" />
			Search
		</div>
	</div>
</template>

<style lang="less">
@import '../../../../styles/_import';

.previewIcon > .fa + .fa {
	margin-left: 1rem;
}
.previewIcon__inline {
	font-size: @font-sml;
}
</style>
