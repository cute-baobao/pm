// import db from '@/db';
// import { member } from '@/db/schemas';
// import { setActiveOrganization } from '@/features/organization/server/service';
// import { auth } from '@/lib/auth';
// import { mkdir, writeFile } from 'fs/promises';
// import path from 'path';
// import { describe, expect, it } from 'vitest';
// import { createTRPCCaller, TRPCCallerResult } from '../utils/trpc-caller';

// const OUTPUT_CSV_PATH = 'e:/test/users.csv';
// const USER_COUNT = 500;
// const ORG_COUNT = 100;
// const USERS_PER_ORG = 5;
// const DEFAULT_PASSWORD = 'Pass123.';

// type SeedUser = {
//   email: string;
//   password: string;
//   userId: string;
//   caller: TRPCCallerResult;
// };

// const formatId = (prefix: string, value: number) =>
// 	`${prefix}-${String(value).padStart(3, '0')}`;

// const ensureUserWithCaller = async (
//   email: string,
//   password: string,
//   name: string,
// ): Promise<SeedUser> => {
//   try {
//     await auth.api.signUpEmail({
//       body: {
//         email,
//         password,
//         name,
//       },
//     });
//   } catch {
//   }

//   const callerResult = await createTRPCCaller(email, password);
//   if (!callerResult) {
//     throw new Error(`Failed to sign in user: ${email}`);
//   }

//   const sessionUserId =
//     callerResult.session?.user?.id || callerResult.session?.session?.userId;

//   if (!sessionUserId) {
//     throw new Error(`Failed to resolve user id from session: ${email}`);
//   }

//   return {
//     email,
//     password,
//     userId: sessionUserId,
//     caller: callerResult,
//   };
// };

// const createSeedUsers = async () => {
//   const users: SeedUser[] = [];

// 	for (let userIndex = 1; userIndex <= USER_COUNT; userIndex += 1) {
// 		const email = `user${String(userIndex).padStart(3, '0')}@test.com`;
// 		const name = `User ${String(userIndex).padStart(3, '0')}`;
// 		const user = await ensureUserWithCaller(email, DEFAULT_PASSWORD, name);
// 		users.push(user);
// 	}

//   return users;
// };

// describe('Generate load-test users CSV', () => {
// 	it(
// 		'creates 500 real users and tenant data via TRPC, then exports CSV',
// 		async () => {
// 			const users = await createSeedUsers();
// 			const header = 'email,password,userId,orgId,projId,taskId1,taskId2';
// 			const rows: string[] = [];

// 			for (let orgIndex = 1; orgIndex <= ORG_COUNT; orgIndex += 1) {
// 				const start = (orgIndex - 1) * USERS_PER_ORG;
// 				const orgUsers = users.slice(start, start + USERS_PER_ORG);
// 				const owner = orgUsers[0];

// 				if (!owner) {
// 					throw new Error(`Missing owner for organization index ${orgIndex}`);
// 				}

// 				const suffix = String(orgIndex).padStart(3, '0');
// 				const organization = await owner.caller.caller.organization.create({
// 					name: `Load Test Org ${suffix}`,
// 					slug: `load-test-org-${suffix}-${Date.now()}`,
// 					logo: 'https://example.com/logo.png',
// 				});

// 				await setActiveOrganization(
// 					owner.caller.session?.session.token!,
// 					organization.id,
// 				);

// 				const nonOwnerMembers = orgUsers
// 					.slice(1)
// 					.map((orgUser) => ({
// 						organizationId: organization.id,
// 						userId: orgUser.userId,
// 						role: 'member' as const,
// 					}));

// 				if (nonOwnerMembers.length > 0) {
// 					await db.insert(member).values(nonOwnerMembers);
// 				}

// 				const project = await owner.caller.caller.project.create({
// 					name: `Load Test Project ${suffix}`,
// 					organizationId: organization.id,
// 					description: `Project for org ${suffix}`,
// 					image: 'https://example.com/project.png',
// 				});

// 				const assignee1 = orgUsers[1]?.userId ?? owner.userId;
// 				const assignee2 = orgUsers[2]?.userId ?? owner.userId;

// 				const task1 = await owner.caller.caller.task.create({
// 					name: `Task A ${suffix}`,
// 					projectId: project.id,
// 					organizationId: organization.id,
// 					assignedId: assignee1,
// 					status: 'TODO',
// 					dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
// 					description: `Task A for org ${suffix}`,
// 				});

// 				const task2 = await owner.caller.caller.task.create({
// 					name: `Task B ${suffix}`,
// 					projectId: project.id,
// 					organizationId: organization.id,
// 					assignedId: assignee2,
// 					status: 'IN_PROGRESS',
// 					dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
// 					description: `Task B for org ${suffix}`,
// 				});

// 				for (const orgUser of orgUsers) {
// 					rows.push(
// 						[
// 							orgUser.email,
// 							orgUser.password,
// 							orgUser.userId,
// 							organization.id,
// 							project.id,
// 							task1.id,
// 							task2.id,
// 						].join(','),
// 					);
// 				}
// 			}

// 			await mkdir(path.dirname(OUTPUT_CSV_PATH), { recursive: true });
// 			await writeFile(OUTPUT_CSV_PATH, [header, ...rows].join('\n'), 'utf-8');

// 			expect(rows).toHaveLength(USER_COUNT);
// 			expect(rows[0]).toContain('user001@test.com');
// 			expect(rows[499]).toContain('user500@test.com');
// 			expect(rows[499]).toContain(',');
// 		},
// 		0,
// 	);
// });
