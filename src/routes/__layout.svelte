<script>
	import '../app.css';
</script>

<div class="sized">
	<slot />
</div>

<style>
	@media (min-width: 1024px) {
		.sized {
			max-width: 1000px;
			margin: 0 auto;
		}
	}
</style>
