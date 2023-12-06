<template>
	<div class="m-4">
		<span :class="{'text-state-success': store.isCounterEven}">
			{{ store.counter }}
		</span>
		<PkpButton class="ml-4" @click="store.increaseCounter">
			Increase Counter
		</PkpButton>
	</div>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';

import {useExamplePageStore} from './examplePageStore';

/** Connect with store, to be able use any state/computed/methods from it */
const store = useExamplePageStore();
</script>
