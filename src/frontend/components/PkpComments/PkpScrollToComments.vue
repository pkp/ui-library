<template>
	<div class="pkpScrollToComments">
		<BaseScrollToCommentsAllComments />
		<BaseScrollToCommentsLogInto />
	</div>
</template>

<script setup>
import BaseScrollToCommentsAllComments from './base/BaseScrollToCommentsAllComments.vue';
import BaseScrollToCommentsLogInto from './base/BaseScrollToCommentsLogInto.vue';
</script>

<style>
.pkpScrollToComments {
	display: flex;
	flex-direction: column;
}
</style>
