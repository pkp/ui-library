<template>
	<DropdownMenuTrigger as-child class="BaseDropdownMenuTrigger">
		<button class="pkpDropdownActions__trigger">
			<slot />
		</button>
	</DropdownMenuTrigger>
</template>
<script setup>
import {DropdownMenuTrigger} from 'reka-ui';
</script>
