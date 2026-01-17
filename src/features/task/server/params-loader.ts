import { createLoader } from 'nuqs/server';
import { taskPaginationParams, taskParams } from '../params';

export const taskParamsLoader = createLoader(taskParams);

export const taskPaginationParamsLoader = createLoader(taskPaginationParams);