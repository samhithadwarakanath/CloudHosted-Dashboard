<script>
  import { goto } from '$app/navigation';

  function login() {
    goto('/auth/login/google');
  }
</script>

<div class="home">
  <h1>🐾 Cat Facts Dashboard</h1>
  <p>Log in with Google to explore and manage cat facts!</p>
  <button class="login-btn" onclick={login}>Sign in with Google</button>
</div>

<style>
  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 90vh;
    text-align: center;
    gap: 1rem;
    font-family: 'Inter', sans-serif;
  }

  h1 {
    font-size: 2.5rem;
    color: #222;
  }

  p {
    color: #666;
  }

  .login-btn {
    background: #4285f4;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .login-btn:hover {
    background: #357ae8;
  }
</style>
