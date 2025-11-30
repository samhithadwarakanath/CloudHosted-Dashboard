<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
  

  let catFacts = $state<{ id: number; fact: string }[]>([]);
  let newFact = $state('');

  async function loadFacts() {
    const res = await fetch('/api/cats');
    if (res.ok) catFacts = await res.json();
  }

  async function addFact() {
    if (!newFact.trim()) return;

    await fetch('/api/cats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fact: newFact })
    });

    newFact = '';
    loadFacts();
  }

  async function deleteFact(id: number) {
    await fetch(`/api/cats/${id}`, { method: 'DELETE' });
    loadFacts();
  }

  
</script>

<h1 class="title">🐱 Dashboard</h1>
<p class="subtitle">Welcome! You’re logged in with <strong>{data.user.email}</strong>.</p>

<section class="card">
  <h2>🐾 Cat Facts CRUD</h2>

  <div class="input-row">
    <input
      type="text"
      placeholder="Enter a new cat fact"
      bind:value={newFact}
      onkeydown={(e) => e.key === 'Enter' && addFact()}
    />
    <button onclick={addFact}>➕ Add Fact</button>
    <button onclick={loadFacts}>🔄 Load Facts</button>
  </div>

  <ul>
    {#each catFacts as cat}
      <li class="fact-item">
        <span>{cat.fact}</span>
        <button class="delete-btn" onclick={() => deleteFact(cat.id)}>❌</button>
      </li>
    {/each}
  </ul>
</section>

<style>
  .title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2a2a2a;
    margin-bottom: 0.25rem;
  }

  .subtitle {
    color: #555;
    margin-bottom: 1.5rem;
  }

  .card {
    background: #fff;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
  }

  .input-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  input {
    flex: 1;
    padding: 0.6rem 0.8rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
  }

  button {
    padding: 0.6rem 1rem;
    border: none;
    border-radius: 8px;
    background-color: #4b8ef7;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  button:hover {
    background-color: #377be6;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  .fact-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f9f9f9;
    margin: 0.4rem 0;
    padding: 0.5rem 1rem;
    border-radius: 6px;
  }

  .delete-btn {
    background: #ff6b6b;
    color: white;
    font-size: 1rem;
    padding: 0.4rem 0.6rem;
    border-radius: 6px;
  }

  .delete-btn:hover {
    background: #e55656;
  }
</style>
