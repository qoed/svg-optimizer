<script>
	import { createDownload } from './file';
	import IcDownload from './IcDownload.svelte';

	/**@type {string}*/
	export let collection;
	/**@type {"unplugin-icons"|"IconifyJSON"}*/
	export let type;
	/**@type {string}*/
	export let label;
	/**@type {any}*/
	export let iconSet;

	function handleClick() {
		createDownload({ name: collection + '-' + type, content: iconSet }, { type: 'json' });
	}
</script>

<section class="mb">
	<button
		class="flex items-center justify-center pad rounded w-full h-full"
		type="button"
		on:click={handleClick}
	>
		<span class="text-2xl flex">
			<IcDownload />
		</span>
		<span class="ml text-lg">{label}</span>
	</button>
</section>

<style>
	button {
		background-color: var(--qoed-black-light);
	}
	button:hover {
		background-color: var(--qoed-black);
	}
</style>
