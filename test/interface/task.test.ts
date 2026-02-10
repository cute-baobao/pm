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
    name: 'task-interface-organization',
    slug: 'task-interface-organization',
    logo: 'https://example.com/logo.png',
  });

  await setActiveOrganization(owner?.session?.session.token!, organization.id);

  project = await owner!.caller.project.create({
    name: 'task-interface-project',
    description: 'project for task tests',
    organizationId: organization.id,
  });

  // create some tasks
  const userId = owner!.session!.session.userId;
  const now = new Date();

  await owner!.caller.task.create({
    name: '普通任务1',
    status: 'TODO',
    description: '普通任务',
    dueDate: now,
    projectId: project.id,
    organizationId: organization.id,
    assignedId: userId,
  });

  await owner!.caller.task.create({
    name: '重要任务 A',
    status: 'TODO',
    description: '包含关键字的重要',
    dueDate: now,
    projectId: project.id,
    organizationId: organization.id,
    assignedId: userId,
  });

  await owner!.caller.task.create({
    name: '普通任务2',
    status: 'TODO',
    description: '普通任务',
    dueDate: now,
    projectId: project.id,
    organizationId: organization.id,
    assignedId: userId,
  });
});

describe('Task Create API', () => {
  it('正常创建任务，返回完整的任务信息', async () => {
    const now = new Date('2024-12-31');
    const res = await owner!.caller.task.create({
      name: '新任务',
      projectId: project.id,
      organizationId: organization.id,
      assignedId: owner!.session!.session.userId,
      status: 'TODO',
      dueDate: now,
      description: '这是一个新创建的任务',
    });

    expect(res).not.toBeNull();
    expect(res).toHaveProperty('id');
  });

  it('缺少必填字段，抛出BAD_REQUEST错误', async () => {
    await expect(
      owner!.caller.task.create({
        projectId: project.id,
        organizationId: organization.id,
      } as any),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
  });
});

describe('Task List API', () => {
  it('正常获取任务列表，返回分页数据', async () => {
    const res = await owner!.caller.task.getManyWithPagination({
      organizationId: organization.id,
      projectId: project.id,
      page: 1,
      pageSize: 2,
    });

    expect(res).toHaveProperty('items');
    expect(res).toHaveProperty('page');
    expect(res).toHaveProperty('pageSize');
    expect(res).toHaveProperty('totalCount');
    expect(res).toHaveProperty('totalPages');
    expect(Array.isArray(res.items)).toBe(true);
  });

  it('搜索任务，返回包含关键词“重要”的任务列表', async () => {
    const res = await owner!.caller.task.getManyWithPagination({
      organizationId: organization.id,
      projectId: project.id,
      search: '重要',
      page: 1,
      pageSize: 10,
    });

    expect(res.items.some((t: any) => t.name.includes('重要'))).toBe(true);
  });

  it('超出分页限制，抛出 BAD_REQUEST 错误', async () => {
    await expect(
      owner!.caller.task.getManyWithPagination({
        organizationId: organization.id,
        projectId: project.id,
        page: 1,
        pageSize: 101,
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
  });
});

afterAll(async () => {
  if (owner && organization) {
    await owner!.caller.organization.delete({ id: organization.id });
  }
});
