import { beforeAll, describe, expect, it } from 'vitest';
import { createTRPCCaller, TRPCCallerResult } from '../utils/trpc-caller';
import { setActiveOrganization } from '@/features/organization/server/service';

let caller: TRPCCallerResult['caller'];
let session: TRPCCallerResult['session'];

beforeAll(async () => {
  const result = await createTRPCCaller('bao@mail.com', 'Zhizhi99.');
  expect(result).not.toBeNull();
  caller = result!.caller; // or result if organization is not nested
  session = result!.session;
});

describe('Organization Interface', () => {
  it('create organization -> update organization -> delete organization', async () => {
    const organization = await caller?.organization.create({
      name: 'Test Organization',
      slug: 'test-organization',
      logo: 'https://example.com/logo.png',
    });

    expect(organization?.name, 'Organization name is incorrect').toBe(
      'Test Organization',
    );

    await setActiveOrganization(session?.session.token!, organization!.id);

    const updatedOrganization = await caller?.organization.update({
      id: organization!.id,
      slug: 'updated-organization',
      name: 'Updated Organization',
      logo: 'https://example.com/new-logo.png',
    });

    expect(updatedOrganization?.slug, 'Organization slug is incorrect').toBe(
      'updated-organization',
    );

    const deleteResult = await caller?.organization.delete({
      id: organization!.id,
    });

    expect(deleteResult?.id, 'Organization deletion failed').toBe(
      organization?.id,
    );
  });

  
});
