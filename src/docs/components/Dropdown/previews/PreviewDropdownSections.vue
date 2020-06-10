<template>
	<dropdown label="Grouped Actions">
		<div class="pkpDropdown__section">
			You are currently logged in as dbarnes.
		</div>
		<div class="pkpDropdown__section">
			<ul>
				<li>
					<a href="#" class="pkpDropdown__action">View Profile</a>
				</li>
				<li>
					<a href="#" class="pkpDropdown__action">Logout</a>
				</li>
			</ul>
		</div>
		<div class="pkpDropdown__section">
			Change Language
			<ul>
				<li>
					<a href="#" class="pkpDropdown__action">
						<icon icon="check" :inline="true" />
						English
					</a>
				</li>
				<li>
					<a href="#" class="pkpDropdown__action">
						Français (Canada)
					</a>
				</li>
				<li>
					<a href="#" class="pkpDropdown__action">
						العربية
					</a>
				</li>
			</ul>
		</div>
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
