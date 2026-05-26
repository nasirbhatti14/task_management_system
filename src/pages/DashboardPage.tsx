import { useState, useEffect } from "react";
import { PlusCircle, Search, LogOut } from "lucide-react";
import { format } from "date-fns";
import { api } from "../api";
import { Task, User } from "../types";
import { TaskForm } from "../components/TaskForm";

export function DashboardPage({ user, onLogout }: { user: User, onLogout: () => void }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  
  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchTasks = async () => {
    try {
      const { data } = await api.get<Task[]>("/tasks", {
        params: { search, status: statusFilter }
      });
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const timeoutId = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search, statusFilter]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const getProgress = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === "Completed").length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
              ✓
            </div>
            <h1 className="text-xl font-semibold tracking-tight">TaskFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-slate-500">
              Welcome, <span className="font-medium text-slate-900">{user.username}</span>
            </div>
            <button
              onClick={onLogout}
              className="text-slate-500 hover:text-slate-800 transition-colors p-2 rounded-md hover:bg-slate-100"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress Bar Section */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h2 className="text-lg font-medium text-slate-800">Your Progress</h2>
              <p className="text-sm text-slate-500">Track your completed tasks</p>
            </div>
            <span className="text-2xl font-bold text-indigo-600">{getProgress()}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-500 ease-out rounded-full"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </section>

        {/* Controls Section */}
        <section className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex-1 w-full max-w-md relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm"
            />
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none hover:bg-slate-50 transition-colors bg-white shadow-sm font-medium text-slate-700"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button
              onClick={() => {
                setEditingTask(undefined);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              New Task
            </button>
          </div>
        </section>

        {/* Task List Section */}
        <section className="grid gap-4">
          {tasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed text-slate-500">
              <p className="text-lg">No tasks found.</p>
              <p className="text-sm mt-1">Create a new task or adjust your filters.</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`text-lg font-semibold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.title}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                      task.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                      task.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">{task.description}</p>
                  )}
                  {task.due_date && (
                    <div className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded inline-block">
                      Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                    </div>
                  )}
                </div>
                <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <button 
                    onClick={() => { setEditingTask(task); setIsFormOpen(true); }}
                    className="flex-1 sm:flex-none px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)}
                    className="flex-1 sm:flex-none px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {isFormOpen && (
        <TaskForm 
          task={editingTask} 
          onClose={() => setIsFormOpen(false)} 
          onSave={() => {
            setIsFormOpen(false);
            fetchTasks();
          }} 
        />
      )}
    </div>
  );
}
