<template>
	<div class="viewPageHeader">
		<page-header :level="1">
			Articles
			<template slot="actions">
				<pkp-button label="Filter" icon="filter" />
				<pkp-button label="Edit" />
			</template>
		</page-header>
	</div>
</template>

<script>
import PageHeader from '@/components/PageHeader/PageHeader.vue';
import PkpButton from '@/components/Button/Button.vue';

export default {
	components: {
		PageHeader,
		PkpButton,
	},
};
</script>
