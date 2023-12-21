import Dropdown from './Dropdown.vue';

export default {
	title: 'Components/Dropdown',
	component: Dropdown,
};

export const Default = {
	render: (args) => ({
		components: {Dropdown},
		setup() {
			return {args};
		},
		template: `
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
		`,
	}),
};

export const WithSections = {
	render: (args) => ({
		components: {Dropdown},
		setup() {
			return {args};
		},
		template: `
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
							<a href="#" class="pkpDropdown__action">Français (Canada)</a>
						</li>
						<li>
							<a href="#" class="pkpDropdown__action">العربية</a>
						</li>
					</ul>
				</div>
			</dropdown>
		`,
	}),
};
