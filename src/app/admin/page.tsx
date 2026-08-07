import { getGoal, getTasks } from "../actions";
import AdminDashboardClient from "./admin-client";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Fetch initial data on the server
  const goalResult = await getGoal();
  const tasksResult = await getTasks();

  const goalData = goalResult.success && goalResult.data ? goalResult.data : null;
  const serializedGoal = {
    amount: goalData ? goalData.amount : 5000.0,
    startDate: goalData?.startDate || '',
    startTime: goalData?.startTime || '',
    endDate: goalData?.endDate || '',
    endTime: goalData?.endTime || '',
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
      initialGoal={serializedGoal}
      initialTasks={serializedTasks}
    />
  );
}
