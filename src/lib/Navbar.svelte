<script>
	import QoedLogo from '../lib/QoedLogo.svelte';
</script>

<nav class="flex w-full mb">
	<ul class="flex w-full">
		<li class="text-primary nav-item">
			<QoedLogo />
		</li>
		<li class="nav-item flex items-center">
			<h1>SVG Optimizer</h1>
		</li>
	</ul>
</nav>

<style>
	.nav-item {
		height: 50px;
		min-width: 5rem;
		padding: 1rem;
	}
</style>
