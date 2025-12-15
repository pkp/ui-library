<template>
	<Label :for="textAreaId" :class="{'sr-only': props.isLabelSrOnly}">
		{{ props.label }}
	</Label>
</template>
<script setup>
import {Label} from 'reka-ui';

import {inject} from 'vue';

const props = inject('textAreaProps');
const textAreaId = inject('textAreaId');
</script>
