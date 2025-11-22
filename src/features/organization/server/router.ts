import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { createOrganizationSchema } from '../schema';
import { checkSlugAvailability, createOrganiztion } from './service';

export const organizationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createOrganizationSchema)
    .mutation(async ({ input, ctx }) => {
      const check = await checkSlugAvailability(input.slug);
      if (!check) {
        throw new TRPCError({
          message: 'Slug is already taken',
          code: 'CONFLICT',
        });
      }
      ctx.auth.user;
      const organization = await createOrganiztion(input, ctx.auth.user!);
      return organization;
    }),
});
