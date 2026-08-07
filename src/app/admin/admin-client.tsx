'use client';

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TaskCard, TaskType } from "@/components/ui/task-card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { createTask, updateTask, deleteTask, updateGoal } from "../actions";
import { Plus, Mail, ShieldAlert, Search, Landmark, Coins, ClipboardList, CheckCircle, Target, Calendar, Clock, Hourglass } from "lucide-react";

interface AdminDashboardClientProps {
  initialGoal: {
    amount: number;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  };
  initialTasks: TaskType[];
}

export default function AdminDashboardClient({
  initialGoal,
  initialTasks,
}: AdminDashboardClientProps) {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | null>(null);
  const [username, setUsername] = React.useState("");
  const [authError, setAuthError] = React.useState("");
  
  // Dashboard states
  const [goal, setGoal] = React.useState(initialGoal.amount);
  const [startDate, setStartDate] = React.useState(initialGoal.startDate);
  const [startTime, setStartTime] = React.useState(initialGoal.startTime);
  const [endDate, setEndDate] = React.useState(initialGoal.endDate);
  const [endTime, setEndTime] = React.useState(initialGoal.endTime);
  const [tasks, setTasks] = React.useState<TaskType[]>(initialTasks);
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Settings saving states
  const [isSavingSettings, setIsSavingSettings] = React.useState(false);
  const [settingsSuccess, setSettingsSuccess] = React.useState(false);
  
  // Dialog (Modal) states
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<TaskType | null>(null);
  const [taskName, setTaskName] = React.useState("");
  const [taskAmount, setTaskAmount] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Check session on mount
  React.useEffect(() => {
    const session = sessionStorage.getItem("adminSession");
    setIsLoggedIn(session === "true");
  }, []);

  // Handle Admin Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === "admin@mattengg.com") {
      sessionStorage.setItem("adminSession", "true");
      setIsLoggedIn(true);
      setAuthError("");
    } else {
      setAuthError("Invalid username. Access is restricted to admin@mattengg.com.");
    }
  };

  // Handle Admin Logout
  const handleLogout = () => {
    sessionStorage.removeItem("adminSession");
    setIsLoggedIn(false);
  };

  // Handle Goal Update from Navbar
  const handleGoalUpdate = async (newGoal: number) => {
    setGoal(newGoal); // optimistic update
    const result = await updateGoal(newGoal, startDate, startTime, endDate, endTime);
    if (!result.success) {
      alert("Failed to save goal to the database. Reverting.");
      setGoal(goal);
    }
  };

  // Handle Campaign Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSuccess(false);

    const result = await updateGoal(
      goal,
      startDate || null,
      startTime || null,
      endDate || null,
      endTime || null
    );

    if (result.success) {
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } else {
      alert(result.error || "Failed to save settings");
    }
    setIsSavingSettings(false);
  };

  // Open Dialog for Adding Task
  const handleOpenAddDialog = () => {
    setEditingTask(null);
    setTaskName("");
    setTaskAmount("");
    setFormError("");
    setIsDialogOpen(true);
  };

  // Open Dialog for Editing Task
  const handleOpenEditDialog = (task: TaskType) => {
    setEditingTask(task);
    setTaskName(task.taskName);
    setTaskAmount(task.amount.toString());
    setFormError("");
    setIsDialogOpen(true);
  };

  // Handle Task Submit (Create/Update)
  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!taskName.trim()) {
      setFormError("Task name is required");
      return;
    }
    const amountNum = parseFloat(taskAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setFormError("Please enter a valid positive number of clients");
      return;
    }

    setIsSubmitting(true);
    if (editingTask) {
      // Update action
      const result = await updateTask(editingTask.id, taskName.trim(), amountNum);
      if (result.success && result.data) {
        const updated: TaskType = {
          id: result.data.id,
          taskName: result.data.taskName,
          amount: result.data.amount,
          createdAt: result.data.createdAt.toISOString(),
        };
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updated : t)));
        setIsDialogOpen(false);
      } else {
        setFormError(result.error || "Failed to update task");
      }
    } else {
      // Create action
      const result = await createTask(taskName.trim(), amountNum);
      if (result.success && result.data) {
        const created: TaskType = {
          id: result.data.id,
          taskName: result.data.taskName,
          amount: result.data.amount,
          createdAt: result.data.createdAt.toISOString(),
        };
        setTasks((prev) => [created, ...prev]);
        setIsDialogOpen(false);
      } else {
        setFormError(result.error || "Failed to create task");
      }
    }
    setIsSubmitting(false);
  };

  // Handle Task Delete
  const handleTaskDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      const originalTasks = [...tasks];
      setTasks((prev) => prev.filter((t) => t.id !== id)); // optimistic delete

      const result = await deleteTask(id);
      if (!result.success) {
        alert("Failed to delete task. Reverting.");
        setTasks(originalTasks);
      }
    }
  };

  // Calculations
  const totalTaskAmount = tasks.reduce((sum, task) => sum + task.amount, 0);
  const remainingBalance = goal - totalTaskAmount;
  const percentageSpent = Math.min((totalTaskAmount / (goal || 1)) * 100, 100);

  // Filtering
  const filteredTasks = tasks.filter((t) =>
    t.taskName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Prevent flash during initial session check
  if (isLoggedIn === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#e1e9f2]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#73a0c8] border-t-transparent" />
      </div>
    );
  }

  // Render Admin Login UI
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-[#e1e9f2]">
        {/* Header spacer */}
        <div className="w-full" />

        {/* Login Card */}
        <main className="w-full max-w-md my-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <Card className="glass-card shadow-lg border border-white/60 p-8">
              <CardHeader className="text-center p-0 mb-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#73a0c8]/10 text-[#73a0c8] mb-4">
                  <Landmark className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-black font-heading text-slate-800 uppercase tracking-tight">
                  Admin Login
                </CardTitle>
                <CardDescription className="mt-1 text-slate-500 font-medium">
                  Enter your admin credentials to continue
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-0">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-slate-600">Username</Label>
                    <div className="relative">
                      <Input
                        id="username"
                        type="email"
                        placeholder="admin@mattengg.com"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-11"
                        required
                      />
                      <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  {authError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200/50 p-3.5 text-xs font-semibold text-rose-600"
                    >
                      <ShieldAlert className="h-4 w-4 shrink-0" />
                      <span>{authError}</span>
                    </motion.div>
                  )}

                  <Button type="submit" className="w-full mt-2 cursor-pointer font-bold">
                    Login to Dashboard
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </main>

        <Footer />
      </div>
    );
  }

  // Render Admin Dashboard UI
  return (
    <div className="flex min-h-screen flex-col bg-[#e1e9f2]">
      {/* Top Navbar */}
      <Navbar
        isAdmin={true}
        goalAmount={goal}
        onGoalUpdate={handleGoalUpdate}
        onLogout={handleLogout}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Dashboard Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Task Amount */}
            <Card className="glass-card overflow-hidden">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total Completed
                  </p>
                  <h3 className="mt-2 font-heading text-3xl font-black text-slate-800">
                    <AnimatedNumber value={totalTaskAmount} />
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#73a0c8]/10 text-[#73a0c8]">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            {/* Current Goal */}
            <Card className="glass-card overflow-hidden">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Target Goal (Clients)
                  </p>
                  <h3 className="mt-2 font-heading text-3xl font-black text-slate-800">
                    <AnimatedNumber value={goal} />
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#73a0c8]/10 text-[#73a0c8]">
                  <Target className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            {/* Remaining Balance */}
            <Card className="glass-card overflow-hidden">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Pending Clients
                  </p>
                  <h3 className="mt-2 font-heading text-3xl font-black text-slate-800">
                    <AnimatedNumber value={remainingBalance} />
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#73a0c8]/10 text-[#73a0c8]">
                  <ClipboardList className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Settings Card */}
          <Card className="glass-card border border-white/60 bg-white/70">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading font-black text-slate-800 text-lg uppercase tracking-tight flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#73a0c8]" />
                Campaign Settings
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 font-medium">
                Configure your target goal client count and schedule.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                  {/* Goal Input */}
                  <div className="space-y-1.5 col-span-1">
                    <Label htmlFor="campaignGoal" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Goal Count</Label>
                    <Input
                      id="campaignGoal"
                      type="number"
                      value={goal}
                      onChange={(e) => setGoal(parseFloat(e.target.value) || 0)}
                      required
                      min="1"
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>

                  {/* Start Date */}
                  <div className="space-y-1.5 col-span-1">
                    <Label htmlFor="startDate" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>

                  {/* Start Time */}
                  <div className="space-y-1.5 col-span-1">
                    <Label htmlFor="startTime" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-1.5 col-span-1">
                    <Label htmlFor="endDate" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>

                  {/* End Time */}
                  <div className="space-y-1.5 col-span-1">
                    <Label htmlFor="endTime" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="h-10 text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isSavingSettings}
                    className="font-bold rounded-xl h-10 px-6 cursor-pointer"
                  >
                    {isSavingSettings ? "Saving Settings..." : settingsSuccess ? "Settings Saved! ✓" : "Save Campaign Settings"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Goal Completion Progress Bar */}
          <Card className="glass-card p-5">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
              <span>Goal Completion Progress</span>
              <span>{percentageSpent.toFixed(0)}% completed</span>
            </div>
            <div className="w-full bg-slate-200/50 rounded-full h-3 overflow-hidden border border-white/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentageSpent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r from-[#73a0c8] to-[#5185b3]`}
              />
            </div>
          </Card>

          {/* Task Management Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-heading font-black text-2xl text-slate-800 tracking-tight flex items-center gap-2 select-none">
                  <ClipboardList className="h-6 w-6 text-[#73a0c8]" />
                  Project Tasks
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Add, update, or remove tasks below.
                </p>
              </div>

              {/* Task search field */}
              <div className="relative w-full sm:w-72">
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 text-xs rounded-xl"
                />
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Task List Grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, idx) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={idx}
                    onEdit={handleOpenEditDialog}
                    onDelete={handleTaskDelete}
                  />
                ))
              ) : (
                <Card className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4 border border-slate-200/50">
                    <ClipboardList className="h-7 w-7" />
                  </div>
                  <h4 className="font-heading font-bold text-slate-700 text-lg">No tasks found</h4>
                  <p className="text-sm text-slate-400 mt-1 max-w-sm">
                    {searchQuery ? "Try searching for a different name." : "Click the floating '+' button or add a task to get started."}
                  </p>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Floating Plus button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-30"
      >
        <Button
          onClick={handleOpenAddDialog}
          className="h-14 w-14 rounded-full bg-[#73a0c8] hover:bg-[#5a8bb5] text-white flex items-center justify-center shadow-lg shadow-[#73a0c8]/45 hover:shadow-xl hover:shadow-[#73a0c8]/60 cursor-pointer"
        >
          <Plus className="h-7 w-7 stroke-[3px]" />
        </Button>
      </motion.div>

      {/* shadcn Dialog Component */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Add New Task"}
            </DialogTitle>
            <DialogDescription>
              {editingTask ? "Make changes to your task details below." : "Enter details for the new task."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleTaskSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taskName">Task Name</Label>
              <Input
                id="taskName"
                type="text"
                placeholder="e.g. Server Setup"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taskAmount">Completed Clients</Label>
              <Input
                id="taskAmount"
                type="number"
                placeholder="e.g. 250"
                value={taskAmount}
                onChange={(e) => setTaskAmount(e.target.value)}
                required
                disabled={isSubmitting}
                min="0"
                step="any"
              />
            </div>

            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200/50 p-3.5 text-xs font-semibold text-rose-600"
              >
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </motion.div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
                className="w-full sm:w-auto font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto font-bold rounded-xl cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
