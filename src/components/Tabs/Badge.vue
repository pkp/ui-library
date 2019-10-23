<template>
	<div class="badge" v-if="badge">{{ badge }}</div>
</template>

<script>
export default {
	props: {
		badge: {
			type: String,
			default() {
				return '';
			}
		}
	}
};
</script>
