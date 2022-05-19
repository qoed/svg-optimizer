<script>
	/**@type {boolean}*/
	export let showPreview;
	export let previewContainer;
</script>

<section class:hidden={!showPreview} class="pad rounded">
	<h2>Selected</h2>
	<div class="preview pad rounded" bind:this={previewContainer} />
</section>

<style>
	section {
		background-color: var(--qoed-black);
	}

	section h2 {
		border-bottom: 1px solid var(--gray);
	}
	.preview {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(6rem, auto));
	}
</style>
