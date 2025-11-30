import { render } from '@testing-library/svelte';
import { test, expect } from 'vitest';
import TestComponent from '../../components/TestComponent.svelte';

test('TestComponent renders without crashing', () => {
	const { container } = render(TestComponent);
	// Just verify something rendered
	expect(container.innerHTML).not.toBe('');
});
