<template>
	<AccordionRoot collapsible type="multiple">
		<template
			v-for="publicationId in commentsStore.publicationIds"
			:key="publicationId"
		>
			<slot :publication-id="publicationId" />
		</template>
	</AccordionRoot>
</template>
<script setup>
import {AccordionRoot} from 'reka-ui';
import {usePkpCommentsStore} from './usePkpCommentsStore';

const commentsStore = usePkpCommentsStore();
</script>
