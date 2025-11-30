import type { User } from '$lib/db/User.db';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	namespace svelteHTML {
		interface HTMLAttributes<T> {
			'onOutClick'?: () => any;
		}
	}
}

export {};