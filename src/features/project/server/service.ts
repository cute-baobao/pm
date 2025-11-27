import db from '@/db';
import { project } from '@/db/schemas';
import { and, desc, eq, ilike } from 'drizzle-orm';
import {
  CreateProjectData,
  GetProjectParams,
  ProjectPaginationData,
} from '../schema';

export const getOneProject = async (params: GetProjectParams) => {
  const { projectName, organizationId } = params;
  const project = await db.query.project.findFirst({
    where: (p, { eq, and }) =>
      and(eq(p.name, projectName), eq(p.organizationId, organizationId)),
  });

  return project;
};

export const getManyProjectsByOrganization = async (
  data: ProjectPaginationData,
) => {
  const { search, page, pageSize, organizationId } = data;
  const whereCondition = search
    ? and(
        eq(project.organizationId, organizationId),
        ilike(project.name, `%${search}%`),
      )
    : eq(project.organizationId, organizationId);

  const [items, totalCount] = await Promise.all([
    db.query.project.findMany({
      where: whereCondition,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      orderBy: desc(project.createdAt),
    }),
    db.$count(project, whereCondition),
  ]);
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    items,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};

export const createProject = async (data: CreateProjectData) => {
  const [result] = await db
    .insert(project)
    .values({
      name: data.name,
      image: data.image ?? null,
      organizationId: data.organizationId,
      description: data.description ?? null,
    })
    .returning();
  return result;
};

export const deleteProject = async (projectId: string) => {
  const [result] = await db
    .delete(project)
    .where(eq(project.id, projectId))
    .returning();
  return result;
};
