<template>
	<div :class="cn('root')">
		<hr :class="cn('divider')" />
		<div :class="cn('title')">
			{{ t('userComment.previousVersion') }}
		</div>
		<div :class="cn('desc')">
			{{ t('userComment.previousVersion.desc') }}
		</div>
	</div>
</template>

<script setup>
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const {cn} = usePkpStyles('PkpCommentsVersionDivider');
const {t} = usePkpLocalize();
</script>
