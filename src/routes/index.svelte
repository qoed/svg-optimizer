<script>
	import IcOutlineDriveFolderUpload from '../lib/IcOutlineDriveFolderUpload.svelte';
	import SvgCard from '$lib/SvgCard.svelte';
	import PreviewLane from '$lib/PreviewLane.svelte';
	import Navbar from '$lib/Navbar.svelte';
	import Dropzone from '$lib/Dropzone.svelte';

	/**@type {HTMLInputElement}*/
	let fileInput;
	/**@type {HTMLElement}*/
	let previewContainer;
	/**@type {FileList | null | undefined}*/
	let files;
	/**@type {any[]}*/
	let data = [];
	let showPreview = false;
	let completed = 0;
	let disabled = true;
	/** @type {{optimized: {name: string; content: string}[]; preOptimized: {name: string; content: string}[];}}*/
	let results = { optimized: [], preOptimized: [] };
	let errorMessages = [];

	$: allFilesParsed(completed);

	/**@type {(numberOfFiles: number) => void}*/
	function allFilesParsed(numberOfFiles) {
		if (files && data.length === files.length && data.length !== 0) {
			disabled = false;
			showPreview = true;

			return;
		}
	}

	function clean() {
		files = null;
		data = [];
		// previewContainer.innerHTML = '';
	}

	function handleClick() {
		clean();
		fileInput.click();
	}

	/**@type {(e: CustomEvent) => void} */
	function handleFiles(e) {
		clean();
		files = e.detail.files;
		validateFiles();
	}

	function validateFiles() {
		if (!files) return;

		for (let i = 0; i < files.length; i++) {
			let file = files[i];
			if (file.type !== 'image/svg+xml') {
				errorMessages.push({ file: file.name });
				continue;
			}

			readFileContents(file);
		}
	}

	/**@type {(file: File) => void}*/
	function readFileContents(file) {
		let reader = new FileReader();

		reader.addEventListener('loadend', () => {
			let dataString = reader.result;
			if (typeof dataString === 'string') {
				data = [...data, { name: file.name, content: dataString, preserveColor: false }];
				completed += 1;
			}
		});

		reader.readAsText(file, 'string');
	}

	async function handleSubmit() {
		const res = await fetch('/', {
			method: 'POST',
			body: JSON.stringify({
				data
			}),
			headers: {
				accept: 'application/json'
			}
		});

		const body = await res.json();
		results = body;
	}
</script>

<Navbar />

<main>
	<Dropzone {handleFiles}>
		<form id="svg-form" on:submit|preventDefault={handleSubmit} class="flex flex-col items-center">
			<input
				bind:this={fileInput}
				type="file"
				name="svg"
				id="svg"
				accept="image/svg+xml"
				bind:files
				on:change={validateFiles}
				multiple
				style="display:none"
			/>
			<button type="button" class="icon-button pad rounded" on:click={handleClick}
				><IcOutlineDriveFolderUpload /></button
			>
		</form>
	</Dropzone>

	<PreviewLane {showPreview} bind:data />
	{#if files}
		<button form="svg-form" class="button-bg my pad rounded text-lg" {disabled}>Upload</button>
	{/if}
	<section>
		{#if results.optimized.length > 0}
			<h2>Optimized SVGs</h2>
		{/if}
		<div class="results-grid">
			{#each results.optimized as op}
				<SvgCard svg={op} />
			{/each}
		</div>
	</section>
	<section>
		{#if results.preOptimized.length > 0}
			<h2>Original SVGs</h2>
		{/if}
		<div class="results-grid">
			{#each results.preOptimized as preOp}
				<SvgCard svg={preOp} showDownload={false} />
			{/each}
		</div>
	</section>
</main>

<style>
	.results-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
		gap: 2rem;
	}

	main {
		display: grid;
		grid-template-columns: 1fr;
		margin: 0 4rem;
	}
	section {
		margin: 2rem 0;
	}
	h2 {
		margin-bottom: 1rem;
	}
</style>
