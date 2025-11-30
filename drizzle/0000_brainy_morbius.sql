CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`googleId` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`picture` text,
	`accessToken` text NOT NULL,
	`refreshToken` text NOT NULL,
	`idToken` text NOT NULL,
	`expiryDate` integer NOT NULL,
	`timestamp` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_googleId_unique` ON `users` (`googleId`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);