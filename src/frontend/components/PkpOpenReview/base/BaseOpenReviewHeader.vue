<template>
	<AccordionHeader as="div" class="BaseOpenReviewHeader">
		<AccordionTrigger class="BaseOpenReviewHeaderTrigger">
			<slot />
		</AccordionTrigger>
	</AccordionHeader>
</template>
<script setup>
import {AccordionHeader, AccordionTrigger} from 'reka-ui';
</script>
