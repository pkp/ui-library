<template>
	<dropdown label="Actions">
		<ul>
			<li>
				<a class="pkpDropdown__action" href="#">One</a>
			</li>
			<li>
				<button class="pkpDropdown__action">
					Two Two Two Two Two Two Two Two Two Two Two Two Two Two Two Two Two
					Two Two Two Two
				</button>
			</li>
			<li>
				<a class="pkpDropdown__action" href="#">Three</a>
			</li>
			<li>
				<button class="pkpDropdown__action" disabled>Four (disabled)</button>
			</li>
		</ul>
	</dropdown>
</template>

<script>
import Dropdown from '@/components/Dropdown/Dropdown.vue';

export default {
	components: {
		Dropdown
	}
};
</script>
