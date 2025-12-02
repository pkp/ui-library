<template>
	<AccordionHeader as="div" class="BaseOpenReviewRoundHeader">
		<AccordionTrigger class="BaseOpenReviewRoundHeaderTrigger">
			<slot />
		</AccordionTrigger>
	</AccordionHeader>
</template>
<script setup>
import {AccordionHeader, AccordionTrigger} from 'reka-ui';
</script>
