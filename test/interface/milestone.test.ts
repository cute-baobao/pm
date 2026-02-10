import { Organization, Project } from '@/db/schemas';
import { setActiveOrganization } from '@/features/organization/server/service';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createTRPCCaller, TRPCCallerResult } from '../utils/trpc-caller';

let owner: TRPCCallerResult | null;
let organization: Organization;
let project: Project;

beforeAll(async () => {
  owner = await createTRPCCaller('owner@mail.com', 'Zhizhi99.');
  expect(owner).not.toBeNull();

  organization = await owner!.caller.organization.create({
    name: 'milestone-interface-organization',
    slug: 'milestone-interface-organization',
    logo: 'https://example.com/logo.png',
  });

  await setActiveOrganization(owner?.session?.session.token!, organization.id);

  project = await owner!.caller.project.create({
    name: 'milestone-interface-project',
    description: 'project for milestone tests',
    organizationId: organization.id,
  });
});

describe('Milestone API', () => {
  it('正常创建里程碑', async () => {
    const targetDate = new Date('2024-12-31');
    const res = await owner!.caller.milestone.create({
      name: '新里程碑',
      projectId: project.id,
      organizationId: organization.id,
      createdBy: owner!.session!.session.userId,
      description: '这是一个新创建的里程碑',
      targetDate: targetDate,
    });

    expect(res).not.toBeNull();
    expect(res).toHaveProperty('id');
    expect(res.name).toBe('新里程碑');
  });

  it('缺少必填字段，创建里程碑抛出BAD_REQUEST错误', async () => {
    await expect(
      owner!.caller.milestone.create({
        projectId: project.id,
        organizationId: organization.id,
      } as any),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
  });

  
});

afterAll(async () => {
  if (owner && organization) {
    await owner!.caller.organization.delete({ id: organization.id });
  }
});
