<script>
	/**@type {boolean}*/
	export let showPreview;

	/**@type {any[]}*/
	export let data;
</script>

<section class:hidden={!showPreview} class="pad rounded">
	<h2>Selected</h2>
	<div class="preview pad rounded">
		{#each data as file}
			<div class="flex flex-col items-center">
				{@html file.content}
				<div class="flex items-center my-1">
					<label class="text-sm" for={file.name}>Preserve color</label>
					<input class="ml" id={file.name} type="checkbox" bind:checked={file.preserveColor} />
				</div>
			</div>
		{/each}
	</div>
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
		grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
		gap: 1rem;
	}
</style>
