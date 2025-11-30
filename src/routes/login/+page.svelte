<script lang="js">
	function handleGoogleLogin() {
		// redirects to your SvelteKit OAuth route
		window.location.href = '/auth/login/google';
	}
</script>

<h1>Login</h1>
<p>Welcome! Please sign in to continue.</p>

<button onclick={handleGoogleLogin}>Sign in with Google</button>
