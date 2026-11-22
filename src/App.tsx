import { useState, useMemo, type FormEvent } from 'react';
import { Check, Plus, Trash2, ListTodo, Circle, CheckCircle2 } from 'lucide-react';
import {
  createTask,
  toggleTask,
  deleteTask,
  filterTasks,
  getTaskStats,
  isTitleValid,
  type Task,
  type Priority,
  type FilterType,
} from '@/lib/tasks';

const PRIORITY_OPTIONS: { value: Priority; label: string; dot: string }[] = [
  { value: 'low', label: 'Low', dot: 'bg-emerald-400' },
  { value: 'medium', label: 'Medium', dot: 'bg-amber-400' },
  { value: 'high', label: 'High', dot: 'bg-rose-400' },
];

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

const priorityStyles: Record<Priority, { dot: string; badge: string }> = {
  low: {
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
  medium: {
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
  high: {
    dot: 'bg-rose-400',
    badge: 'bg-rose-50 text-rose-700 ring-rose-200',
  },
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [tag, setTag] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => getTaskStats(tasks), [tasks]);
  const visibleTasks = useMemo(
    () => filterTasks(tasks, filter),
    [tasks, filter]
  );

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!isTitleValid(title)) {
      setError(
        title.trim().length === 0
          ? 'Title cannot be empty.'
          : 'Title must be 100 characters or fewer.'
      );
      return;
    }
    setError(null);
    const newTask = createTask(title, priority, tag);
    setTasks((prev) => [newTask, ...prev]);
    setTitle('');
    setTag('');
  };

  const handleToggle = (id: string) => {
    setTasks((prev) => toggleTask(prev, id));
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => deleteTask(prev, id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <ListTodo className="h-6 w-6" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Task Tracker
            </h1>
            <p className="text-sm text-slate-500">
              Stay on top of your day, one task at a time.
            </p>
          </div>
        </header>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                New task
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Finish quarterly review"
                maxLength={100}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="priority"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-1.5 rounded-lg bg-slate-100 p-1">
                  {PRIORITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPriority(opt.value)}
                      className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition ${
                        priority === opt.value
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${opt.dot}`} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="tag"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Tag <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  id="tag"
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. work"
                  maxLength={30}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-rose-600">{error}</p>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] sm:w-auto"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add task
            </button>
          </form>
        </section>

        <section className="mb-6 grid grid-cols-3 gap-3">
          {(
            [
              { label: 'Total', value: stats.total, icon: ListTodo },
              { label: 'Active', value: stats.active, icon: Circle },
              { label: 'Done', value: stats.completed, icon: CheckCircle2 },
            ] as const
          ).map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm"
            >
              <Icon className="mx-auto mb-1 h-4 w-4 text-slate-400" />
              <div className="text-2xl font-bold leading-none">{value}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
              </div>
            </div>
          ))}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your tasks</h2>
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilter(opt.value)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    filter === opt.value
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {visibleTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <ListTodo className="mx-auto mb-3 h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">
                {tasks.length === 0
                  ? 'No tasks yet. Add your first one above.'
                  : 'No tasks match this filter.'}
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {visibleTasks.map((task) => {
                const styles = priorityStyles[task.priority];
                return (
                  <li
                    key={task.id}
                    className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300 hover:shadow"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggle(task.id)}
                      aria-label={
                        task.completed ? 'Mark as active' : 'Mark as complete'
                      }
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
                        task.completed
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-300 text-transparent hover:border-emerald-400'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium ${
                          task.completed
                            ? 'text-slate-400 line-through'
                            : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${styles.badge}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
                          />
                          {task.priority}
                        </span>
                        {task.tag && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                            #{task.tag}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      aria-label="Delete task"
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <footer className="mt-10 text-center text-xs text-slate-400">
          Client-side demo with sample data only.
        </footer>
      </div>
    </div>
  );
}

export default App;
