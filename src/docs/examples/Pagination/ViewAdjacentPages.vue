<script>
import ViewPagination from './ViewPagination.vue';

export default {
	extends: ViewPagination,
	data: function () {
		return {
			...ViewPagination.data(),
			showAdjacentPages: 3,
		};
	},
};
</script>
