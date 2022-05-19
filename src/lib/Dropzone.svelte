<script>
	import { drop } from '$lib/file';
	/**@type {(e: CustomEvent) => void} */
	export let handleFiles;
</script>

<section
	class="border-bg dropzone mb pad"
	use:drop
	on:files={(e) => handleFiles(e)}
	title="Drag and drop SVGs here to upload"
>
	<slot />
</section>

<style>
	.dropzone {
		max-width: 50rem;
		min-width: 30rem;
		justify-self: center;
		border-radius: 1rem;
	}
</style>
