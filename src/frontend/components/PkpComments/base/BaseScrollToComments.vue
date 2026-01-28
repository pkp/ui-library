<template>
	<div class="pkpScrollToComments">
		<slot name="allComments" :store="commentsStore">
			<BaseScrollToCommentsAllComments />
		</slot>
		<slot name="logInto" :store="commentsStore">
			<BaseScrollToCommentsLogInto />
		</slot>
	</div>
</template>

<script setup>
import BaseScrollToCommentsAllComments from './BaseScrollToCommentsAllComments.vue';
import BaseScrollToCommentsLogInto from './BaseScrollToCommentsLogInto.vue';
import {usePkpCommentsStore} from '../usePkpCommentsStore';

const commentsStore = usePkpCommentsStore();
</script>

<style>
.pkpScrollToComments {
	display: flex;
	flex-direction: column;
}
</style>
