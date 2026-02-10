import { setActiveOrganization } from '@/features/organization/server/service';
import { beforeAll, describe, expect, it } from 'vitest';
import { createTRPCCaller, TRPCCallerResult } from '../utils/trpc-caller';

let owner: TRPCCallerResult | null;

beforeAll(async () => {
  owner = await createTRPCCaller('owner@mail.com', 'Zhizhi99.');
});

describe('Organization Interface', () => {
  it('使用正确的组织创建和删除流程', async () => {
    const organization = await owner!.caller.organization.create({
      name: 'Test Organization',
      slug: 'test-organization',
      logo: 'https://example.com/logo.png',
    });

    expect(organization).not.toBeNull();

    await setActiveOrganization(
      owner?.session?.session.token!,
      organization.id,
    );

    const deletedOrganization = await owner!.caller.organization.delete({
      id: organization.id,
    });

    expect(deletedOrganization).not.toBeNull();
  });

  it('错误的创建组织参数', async () => {
    await expect(
      // @ts-expect-error: intentionally missing `name` for validation test
      owner!.caller.organization.create({
        slug: 'error-organization',
        logo: 'https://example.com/logo.png',
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
  });
});
