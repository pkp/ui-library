<template>
	<div>
		<template v-for="message in messages">
			<slot name="item" :message="message"></slot>
		</template>
	</div>
</template>
<script setup>
const messages = [
	{
		id: 1,
		date: '2023-01-01',
		body: 'This is a great article!',
		author: {
			name: 'John Doe',
			orcid: '0000-0001-2345-6789',
			affiliation: 'University of Example',
		},
	},
	{
		id: 2,
		date: '2023-01-02',
		body: 'Interesting points raised here.',
		author: {
			name: 'Jane Smith',
			orcid: '0000-0002-3456-7890',
			affiliation: 'Research Institute',
		},
	},
];
</script>
