import db from '@/db';

export const getOneProject = async (projectId: string) => {
  const project = await db.query.project.findFirst({
    where: (p, { eq }) => eq(p.id, projectId),
  });

  return project;
};

export const getManyProjectsByOrganization = async (organizationId: string) => {
  const projects = await db.query.project.findMany({
    where: (p, { eq }) => eq(p.organizationId, organizationId),
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });
  return projects;
};
