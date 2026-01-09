import { db } from '.';
import { taskChangeLog } from './schemas/project-schema';

export interface TaskChangeLogInput {
  taskId: string;
  organizationId: string;
  fieldName: string;
  oldValue?: string | number | Date | null;
  newValue: string | number | Date | null;
  changedBy: string | null;
}

/**
 * 记录任务变更
 * @param input 变更记录信息
 */
export async function recordTaskChange(input: TaskChangeLogInput) {
  try {
    const oldValue = input.oldValue
      ? formatChangeLogValue(input.oldValue)
      : null;
    const newValue = input.newValue
      ? formatChangeLogValue(input.newValue)
      : null;
    await db.insert(taskChangeLog).values({
      taskId: input.taskId,
      organizationId: input.organizationId,
      fieldName: input.fieldName,
      oldValue: oldValue,
      newValue: newValue,
      changedBy: input.changedBy,
    });
  } catch (error) {
    console.error('Failed to record task change:', error);
    // 不抛出错误，避免影响主业务流程
  }
}

/**
 * 批量记录任务变更（用于事务内）
 * @param inputs 变更记录信息数组
 */
export async function recordTaskChanges(inputs: TaskChangeLogInput[]) {
  if (inputs.length === 0) return;
  
  try {
    // 过滤掉 oldValue 和 newValue 相同的记录
    const validChanges = inputs.filter((input) => {
      const oldFormatted = input.oldValue
        ? formatChangeLogValue(input.oldValue)
        : null;
      const newFormatted = input.newValue
        ? formatChangeLogValue(input.newValue)
        : null;
      return oldFormatted !== newFormatted;
    });

    if (validChanges.length === 0) return;

    const values = validChanges.map((input) => ({
      taskId: input.taskId,
      organizationId: input.organizationId,
      fieldName: input.fieldName,
      oldValue: input.oldValue
        ? formatChangeLogValue(input.oldValue)
        : null,
      newValue: input.newValue
        ? formatChangeLogValue(input.newValue)
        : null,
      changedBy: input.changedBy ?? null,
    }));

    await db.insert(taskChangeLog).values(values);
  } catch (error) {
    console.error('Failed to record task changes:', error);
    // 不抛出错误，避免影响主业务流程
  }
}

/**
 * 将值转换为可显示的字符串
 * @param value 字段值
 * @param fieldName 字段名
 */
export function formatChangeLogValue(
  value: string | number | Date | null,
): string {
  if (!value) return '-';
  else if (value instanceof Date) return value.toISOString();
  else return String(value);
}
