<template>
	<AccordionRoot
		class="BaseCommentsVersions"
		type="single"
		collapsible
		:default-value="commentsStore.publications[0]?.id"
	>
		<template
			v-for="publication in commentsStore.publications"
			:key="publication.id"
		>
			<slot :publication="publication" :publication-id="publication.id" />
		</template>
	</AccordionRoot>
</template>
<script setup>
import {AccordionRoot} from 'reka-ui';
import {usePkpCommentsStore} from '../usePkpCommentsStore';

const commentsStore = usePkpCommentsStore();
</script>
../usePkpCommentsStore
