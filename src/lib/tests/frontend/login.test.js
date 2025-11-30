import { render, screen } from '@testing-library/svelte';
import { test, expect } from 'vitest';
import Login from '../../components/pages/LoginPage.svelte';

test('renders login page', () => {
	render(Login);

	expect(screen.getByText(/login/i)).toBeInTheDocument();
	expect(screen.getByText(/welcome/i)).toBeInTheDocument();
	expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
});
