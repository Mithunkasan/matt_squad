'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Fetch specific Goal record (create default 5000 if it doesn't exist)
export async function getGoal(id: string = 'default-goal') {
  try {
    let goal = await db.goal.findUnique({
      where: { id },
    });

    if (!goal) {
      goal = await db.goal.create({
        data: {
          id,
          amount: 5000.0,
        },
      });
    }
    return { success: true, data: goal };
  } catch (error: any) {
    console.error(`Error fetching goal ${id}:`, error);
    return { success: false, error: error.message || 'Failed to fetch goal' };
  }
}

// Update specific Goal record
export async function updateGoal(
  amount: number,
  startDate?: string | null,
  startTime?: string | null,
  endDate?: string | null,
  endTime?: string | null,
  id: string = 'default-goal'
) {
  try {
    const goal = await db.goal.upsert({
      where: { id },
      update: {
        amount,
        startDate,
        startTime,
        endDate,
        endTime,
      },
      create: {
        id,
        amount,
        startDate,
        startTime,
        endDate,
        endTime,
      },
    });
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, data: goal };
  } catch (error: any) {
    console.error(`Error updating goal ${id}:`, error);
    return { success: false, error: error.message || 'Failed to update goal' };
  }
}

// Fetch all Tasks (optionally filtered by goalId)
export async function getTasks(goalId?: string) {
  try {
    const whereClause = goalId ? { goalId } : {};
    const tasks = await db.task.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: tasks };
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return { success: false, error: error.message || 'Failed to fetch tasks' };
  }
}

// Create a new Task associated with a Goal Set
export async function createTask(taskName: string, amount: number, goalId: string = 'default-goal') {
  try {
    const task = await db.task.create({
      data: {
        taskName,
        amount,
        goalId,
      },
    });
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, data: task };
  } catch (error: any) {
    console.error('Error creating task:', error);
    return { success: false, error: error.message || 'Failed to create task' };
  }
}

// Update an existing Task
export async function updateTask(id: string, taskName: string, amount: number) {
  try {
    const task = await db.task.update({
      where: { id },
      data: {
        taskName,
        amount,
      },
    });
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, data: task };
  } catch (error: any) {
    console.error('Error updating task:', error);
    return { success: false, error: error.message || 'Failed to update task' };
  }
}

// Delete a Task
export async function deleteTask(id: string) {
  try {
    const task = await db.task.delete({
      where: { id },
    });
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, data: task };
  } catch (error: any) {
    console.error('Error deleting task:', error);
    return { success: false, error: error.message || 'Failed to delete task' };
  }
}
