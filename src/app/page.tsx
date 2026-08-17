import { getGoal, getTasks } from "./actions";
import LandingContent from "./landing-content";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const goal1Result = await getGoal('default-goal');
  const goal2Result = await getGoal('default-goal-2');
  const tasksResult = await getTasks();

  const goal1Data = goal1Result.success && goal1Result.data ? goal1Result.data : null;
  const goal2Data = goal2Result.success && goal2Result.data ? goal2Result.data : null;
  const allTasks = tasksResult.success && tasksResult.data ? tasksResult.data : [];

  const goal1 = {
    amount: goal1Data ? goal1Data.amount : 5000.0,
    startDate: goal1Data?.startDate || null,
    startTime: goal1Data?.startTime || null,
    endDate: goal1Data?.endDate || null,
    endTime: goal1Data?.endTime || null,
    tasks: allTasks.filter(t => !t.goalId || t.goalId === 'default-goal'),
  };

  const goal2 = {
    amount: goal2Data ? goal2Data.amount : 5000.0,
    startDate: goal2Data?.startDate || null,
    startTime: goal2Data?.startTime || null,
    endDate: goal2Data?.endDate || null,
    endTime: goal2Data?.endTime || null,
    tasks: allTasks.filter(t => t.goalId === 'default-goal-2'),
  };

  return (
    <LandingContent
      goal1={goal1}
      goal2={goal2}
    />
  );
}
