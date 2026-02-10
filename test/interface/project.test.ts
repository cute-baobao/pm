import { Organization } from '@/db/schemas';
import { setActiveOrganization } from '@/features/organization/server/service';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createTRPCCaller, TRPCCallerResult } from '../utils/trpc-caller';

let owner: TRPCCallerResult | null;
let organization: Organization;

beforeAll(async () => {
  owner = await createTRPCCaller('owner@mail.com', 'Zhizhi99.');
  expect(owner).not.toBeNull();
  organization = await owner!.caller.organization.create({
    name: 'project-interface-organization',
    slug: 'project-interface-organization',
    logo: 'https://example.com/logo.png',
  });
});

describe('Project Interface', () => {
  it('使用正确参数的创建项目', async () => {
    await setActiveOrganization(
      owner?.session?.session.token!,
      organization.id,
    );

    const project = await owner!.caller.project.create({
      name: 'Test Project',
      description: 'This is a test project',
      organizationId: organization.id,
    });

    expect(project).not.toBeNull();
    expect(project.name).toBe('Test Project');
  });

  it('缺少必填字段的创建项目参数', async () => {
    await expect(
      // @ts-expect-error: intentionally missing `name` for validation test
      owner!.caller.project.create({
        description: 'This is an error project',
        organizationId: organization.id,
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
  });
});

afterAll(async () => {
  if (owner && organization) {
    await owner!.caller.organization.delete({
      id: organization.id,
    });
  }
});
