<template>
	<a data-target="crossmark">
		<img
			src="https://crossmark-cdn.crossref.org/widget/v2.0/logos/CROSSMARK_Color_horizontal.svg"
			width="150"
			alt="Crossmark"
		/>
	</a>
</template>

<script setup>
import {onMounted} from 'vue';

onMounted(() => {
	if (document.CROSSMARK) {
		document.CROSSMARK.bind();
	}
});
</script>
