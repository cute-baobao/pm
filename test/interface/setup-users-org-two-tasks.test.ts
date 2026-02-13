// import db from '@/db';
// import { member } from '@/db/schemas';
// import { setActiveOrganization } from '@/features/organization/server/service';
// import { mkdir, writeFile } from 'fs/promises';
// import path from 'path';
// import { beforeAll, describe, expect, it } from 'vitest';
// import { accountCleanup, accountPrepar } from '../utils/account-prepar';
// import { createTRPCCaller, TRPCCallerResult } from '../utils/trpc-caller';

// const TEST_EMAILS = ['owner@mail.com', 'admin@mail.com', 'member@mail.com'];
// const OUTPUT_CSV_PATH = 'e:/test/user.csv';

// let ownerCaller: TRPCCallerResult | null = null;
// let ownerId = '';
// let adminId = '';
// let memberId = '';
// let organizationId = '';
// let projectId = '';
// let taskId1 = '';
// let taskId2 = '';

// const exportCsv = async () => {
//   const header = 'email,password,userId,orgId,projId,taskId1,taskId2';
//   const rows = [
//     `member@mail.com,Zhizhi99.,${memberId},${organizationId},${projectId},${taskId1},${taskId2}`,
//     `admin@mail.com,Zhizhi99.,${adminId},${organizationId},${projectId},${taskId1},${taskId2}`,
//     `owner@mail.com,Zhizhi99.,${ownerId},${organizationId},${projectId},${taskId1},${taskId2}`,
//   ];

//   await mkdir(path.dirname(OUTPUT_CSV_PATH), { recursive: true });
//   await writeFile(OUTPUT_CSV_PATH, [header, ...rows].join('\n'), 'utf-8');
// };

// beforeAll(async () => {
//   await accountCleanup(TEST_EMAILS);

//   const accounts = await accountPrepar();
//   ownerId = accounts.owner.user.id;
//   adminId = accounts.admin.user.id;
//   memberId = accounts.member.user.id;

//   ownerCaller = await createTRPCCaller('owner@mail.com', 'Zhizhi99.');
//   expect(ownerCaller).not.toBeNull();

//   const org = await ownerCaller!.caller.organization.create({
//     name: 'setup users organization',
//     slug: `setup-users-org-${Date.now()}`,
//     logo: 'https://example.com/logo.png',
//   });
//   organizationId = org.id;

//   await setActiveOrganization(
//     ownerCaller!.session!.session.token,
//     organizationId,
//   );

//   await db.insert(member).values([
//     {
//       organizationId,
//       userId: adminId,
//       role: 'admin',
//     },
//     {
//       organizationId,
//       userId: memberId,
//       role: 'member',
//     },
//   ]);

//   const project = await ownerCaller!.caller.project.create({
//     name: 'setup users project',
//     organizationId,
//     description: 'project for setup test',
//     image: 'https://example.com/project.png',
//   });
//   projectId = project.id;

//   const task1 = await ownerCaller!.caller.task.create({
//     name: 'Task for admin',
//     projectId,
//     organizationId,
//     assignedId: adminId,
//     status: 'TODO',
//     dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
//     description: 'task assigned to admin',
//   });

//   const task2 = await ownerCaller!.caller.task.create({
//     name: 'Task for member',
//     projectId,
//     organizationId,
//     assignedId: memberId,
//     status: 'IN_PROGRESS',
//     dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
//     description: 'task assigned to member',
//   });

//   taskId1 = task1.id;
//   taskId2 = task2.id;
// });

// describe('Setup users, organization and tasks', () => {
//   it('creates 3 users, 1 organization, and 2 tasks successfully', async () => {
//     expect(ownerId).toBeTruthy();
//     expect(adminId).toBeTruthy();
//     expect(memberId).toBeTruthy();

//     expect(organizationId).toBeTruthy();
//     expect(projectId).toBeTruthy();

//     expect(taskId1).toBeTruthy();
//     expect(taskId2).toBeTruthy();
//     expect(taskId1).not.toEqual(taskId2);

//     await exportCsv();
//   });
// });
