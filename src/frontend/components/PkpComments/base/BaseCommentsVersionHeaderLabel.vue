<template>
	<span class="BaseCommentsVersionHeaderLabel">
		{{ commentsVersionStore.versionLabel }}
	</span>
</template>
<script setup>
import {usePkpCommentsVersionStore} from '../usePkpCommentsVersionStore';

const commentsVersionStore = usePkpCommentsVersionStore();
</script>
