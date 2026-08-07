import { getGoal, getTasks } from "./actions";
import LandingContent from "./landing-content";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const goalResult = await getGoal();
  const tasksResult = await getTasks();

  const goalData = goalResult.success && goalResult.data ? goalResult.data : null;
  const goalAmount = goalData ? goalData.amount : 5000.0;
  const startDate = goalData ? goalData.startDate : null;
  const startTime = goalData ? goalData.startTime : null;
  const endDate = goalData ? goalData.endDate : null;
  const endTime = goalData ? goalData.endTime : null;

  const tasks = tasksResult.success && tasksResult.data ? tasksResult.data : [];
  
  // Calculate total task amount
  const totalTaskAmount = tasks.reduce((sum, task) => sum + task.amount, 0);

  return (
    <LandingContent
      initialGoal={goalAmount}
      initialTotalTaskAmount={totalTaskAmount}
      startDate={startDate}
      startTime={startTime}
      endDate={endDate}
      endTime={endTime}
    />
  );
}
