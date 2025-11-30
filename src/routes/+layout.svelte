<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="navbar">
	<div class="nav-left">
		<a class="brand" href="/">🐱 CatApp</a>
	</div>

	<div class="nav-links">
		<a href="/">Home</a>
		<a href="/login">Login</a>
		<a href="/app">Dashboard</a>
		<a class="logout" href="/auth/logout/google">Logout</a>
	</div>
</nav>

<main class="content">
	{@render children()}
</main>

<style>
	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		background: #ffffff;
		border-bottom: 1px solid #e5e5e5;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.brand {
		font-size: 1.4rem;
		font-weight: 700;
		color: #4b8ef7;
		text-decoration: none;
	}

	.nav-links {
		display: flex;
		gap: 1.2rem;
	}

	.nav-links a {
		text-decoration: none;
		color: #444;
		font-weight: 500;
		padding: 0.3rem 0.5rem;
		border-radius: 5px;
		transition: 0.2s ease;
	}

	.nav-links a:hover {
		background: #f0f4ff;
		color: #316bd9;
	}

	.logout {
		color: #d33;
		font-weight: 600;
	}

	.logout:hover {
		background: #ffe5e5;
		color: #b00;
	}

	.content {
		padding: 2rem;
		max-width: 900px;
		margin: auto;
	}
</style>
