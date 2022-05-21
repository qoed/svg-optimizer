<script>
	import Navbar from '$lib/Navbar.svelte';

	import '../app.css';
</script>

<Navbar />
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
