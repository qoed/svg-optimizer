<script>
	// import 'virtual:windi.css';
</script>

<div class="sized">
	<slot />
</div>

<style>
	@media (min-width: 1920px) {
		.sized {
			max-width: 1000px;
			margin: 0 auto;
		}
	}
</style>
