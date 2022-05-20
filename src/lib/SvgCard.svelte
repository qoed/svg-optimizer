<script>
	import IcDownload from '$lib/IcDownload.svelte';
	import { createDownload, setImage } from '$lib/file';
	import ArrowUp from './ArrowUp.svelte';
	import ArrowRight from './ArrowRight.svelte';
	import ArrowDown from './ArrowDown.svelte';
	/**@type {{name: string; content: string}} */
	export let svg;
	export let showDownload = true;

	let showCode = false;
	let blank = false;
</script>

<div
	class="items-center flex flex-col rounded pad svg-card"
	title={showDownload ? 'Click to download' : ''}
	on:click={() => (blank = true)}
	on:mouseleave={() => (blank = false)}
>
	{#if blank && showDownload}
		<div class="overlay">
			<button
				class="flex flex-col items-center justify-center pad icon-button-sm rounded w-full h-full"
				type="button"
				on:click={() => createDownload(svg, { type: 'image' })}
			>
				<span class="my-1 text-base self-start">{svg.name}</span>
				<span class="text-2xl flex"><IcDownload /></span>
			</button>
		</div>
	{/if}
	<div class="svg-container">
		{@html svg.content}
	</div>

	<button
		class="flex items-center mt code-button"
		type="button"
		title="Expand"
		on:click|stopPropagation={() => (showCode = !showCode)}
	>
		Code
		<span class="text-xl flex">
			{#if showCode}
				<ArrowDown />
			{:else}
				<ArrowRight />
			{/if}
		</span>
	</button>
	{#if showCode}
		<textarea class="my-1 w-full rounded" rows="10" value={svg.content} />
	{/if}
</div>

<style>
	.code-button:hover {
		color: var(--light-gray);
	}
	.svg-card {
		position: relative;
		background-color: var(--qoed-black);
		height: min-content;
	}
	textarea {
		background-color: var(--qoed-black-light);
		color: var(--white);
		padding: 0.5rem;
		border: 1px solid var(--primary);
	}
	.svg-container {
		height: 32px;
	}
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: var(--qoed-black);
	}
</style>
