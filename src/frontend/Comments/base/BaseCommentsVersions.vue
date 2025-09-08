<template>
	<AccordionRoot
		type="single"
		collapsible
		:default-value="commentsStore.publicationIds[0]"
	>
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
../usePkpCommentsStore
