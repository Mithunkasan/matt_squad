import { getGoal, getTasks } from "../actions";
import AdminDashboardClient from "./admin-client";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Fetch initial data on the server for both goals
  const goal1Result = await getGoal('default-goal');
  const goal2Result = await getGoal('default-goal-2');
  const tasksResult = await getTasks();

  const goal1Data = goal1Result.success && goal1Result.data ? goal1Result.data : null;
  const serializedGoal1 = {
    id: 'default-goal',
    amount: goal1Data ? goal1Data.amount : 5000.0,
    startDate: goal1Data?.startDate || '',
    startTime: goal1Data?.startTime || '',
    endDate: goal1Data?.endDate || '',
    endTime: goal1Data?.endTime || '',
  };

  const goal2Data = goal2Result.success && goal2Result.data ? goal2Result.data : null;
  const serializedGoal2 = {
    id: 'default-goal-2',
    amount: goal2Data ? goal2Data.amount : 5000.0,
    startDate: goal2Data?.startDate || '',
    startTime: goal2Data?.startTime || '',
    endDate: goal2Data?.endDate || '',
    endTime: goal2Data?.endTime || '',
  };
  
  const initialTasks = tasksResult.success && tasksResult.data ? tasksResult.data : [];

  // Parse Date objects to string for safety in Client Components
  const serializedTasks = initialTasks.map(task => ({
    ...task,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }));

  return (
    <AdminDashboardClient
      goal1={serializedGoal1}
      goal2={serializedGoal2}
      initialTasks={serializedTasks}
    />
  );
}
