import { render, screen } from '@testing-library/svelte';
import { test, expect } from 'vitest';
import Home from '../../components/pages/HomePage.svelte';

test('home page renders correctly', () => {
	render(Home);

	// Match your real HomePage text (from earlier DOM output)
	expect(screen.getByText(/Cat Facts Dashboard/i)).toBeInTheDocument();
	expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
});
