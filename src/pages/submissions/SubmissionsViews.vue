<template>
	<div class="submissions__views">
		<h1 class="submissions__views__title">
			{{ t('navigation.submissions') }}
		</h1>
		<ul class="submissions__views__list">
			<li
				v-for="view in $store.submissions.views"
				:key="view.id"
				class="submissions__view"
			>
				<button
					class="submissions__view__button"
					:class="
						$store.submissions.currentView.id === view.id
							? 'submissions__view__button--current'
							: ''
					"
					@click="$store.submissions.loadView(view)"
				>
					<span class="submissions__view__count">
						{{ view.count }}
					</span>
					<span class="submissions__view__name">
						{{ view.name }}
					</span>
				</button>
			</li>
		</ul>
	</div>
</template>
<script>
export default {};
</script>
