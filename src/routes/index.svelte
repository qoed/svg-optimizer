<script>
	import IcOutlineDriveFolderUpload from '../lib/IcOutlineDriveFolderUpload.svelte';
	import SvgCard from '$lib/SvgCard.svelte';
	import PreviewLane from '$lib/PreviewLane.svelte';
	import Dropzone from '$lib/Dropzone.svelte';
	import Head from '$lib/Head.svelte';
	import IconSetDownload from '$lib/IconSetDownload.svelte';

	/**@type {HTMLInputElement}*/
	let fileInput;
	/**@type {FileList | null | undefined}*/
	let files;
	/**@type {any[]}*/
	let data = [];
	let showPreview = false;
	let completed = 0;
	let disabled = true;
	/**
	 * @type {{optimizedSvg: {name: string; content: string}[]; svg: {name: string; content: string}[]; iconify: string; unpluginIconSet: string;} }
	 */
	let results = { optimizedSvg: [], svg: [], iconify: '', unpluginIconSet: '' };
	let errorMessages = [];
	let collection = '';

	$: allFilesParsed(completed);

	/**
	 * @param {number} numberOfFiles
	 */
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
	}

	function handleClick() {
		clean();
		fileInput.click();
	}

	/**
	 * @param {{ detail: { files: FileList }; }} e
	 */
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

	/**
	 * @param {File} file
	 */
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
				data,
				prefix: collection
			}),
			headers: {
				accept: 'application/json'
			}
		});

		const body = await res.json();

		results = body;
	}
</script>

<Head />

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
		<div class="collection-input-container">
			<label for="collection">Collection name</label>
			<input
				class="collection-input"
				type="text"
				placeholder="my-custom-icons"
				name="collection"
				id="collection"
				form="svg-form"
				required
				bind:value={collection}
			/>
		</div>
		<button form="svg-form" class="button-bg my pad rounded text-lg" {disabled}>Upload</button>
	{/if}

	{#if results.unpluginIconSet}
		<h2>Icon Sets</h2>
		<IconSetDownload
			{collection}
			iconSet={results.unpluginIconSet}
			type="unplugin-icons"
			label="unplugin-icons"
		/>
	{/if}

	{#if results.iconify}
		<IconSetDownload
			{collection}
			iconSet={results.iconify}
			type="IconifyJSON"
			label="IconifyJSON"
		/>
	{/if}

	<section>
		{#if results.optimizedSvg.length > 0}
			<h2>Optimized SVGs</h2>
		{/if}
		<div class="results-grid">
			{#each results.optimizedSvg as op}
				<SvgCard svg={op} />
			{/each}
		</div>
	</section>
	<section>
		{#if results.svg.length > 0}
			<h2>Original SVGs</h2>
		{/if}
		<div class="results-grid">
			{#each results.svg as preOp}
				<SvgCard svg={preOp} showDownload={false} />
			{/each}
		</div>
	</section>
</main>

<style>
	.collection-input-container {
		margin: 2rem 0;
		display: grid;
		gap: 1rem;
	}
	.collection-input {
		border-radius: 0.5rem;
		border: none;
		outline: var(--gray) solid 0.25rem;
		padding: 0.5rem 1rem;
	}
	.collection-input:focus-visible {
		outline: var(--info) solid 0.25rem;
	}
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
