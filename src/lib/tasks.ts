export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  tag?: string;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TaskStats {
  total: number;
  active: number;
  completed: number;
}

const MAX_TITLE_LENGTH = 100;

export function isTitleValid(title: string): boolean {
  const trimmed = title.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_TITLE_LENGTH;
}

function generateId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    // crypto.randomUUID() throws outside a secure context; fall through.
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createTask(
  title: string,
  priority: Priority,
  tag?: string
): Task {
  const trimmedTitle = title.trim();
  if (trimmedTitle.length === 0) {
    throw new Error('Title must not be empty');
  }
  if (trimmedTitle.length > MAX_TITLE_LENGTH) {
    throw new Error(`Title must be at most ${MAX_TITLE_LENGTH} characters`);
  }
  const trimmedTag = tag?.trim();
  return {
    id: generateId(),
    title: trimmedTitle,
    priority,
    completed: false,
    ...(trimmedTag ? { tag: trimmedTag } : {}),
  };
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
}

export function deleteTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((task) => task.id !== id);
}

export function filterTasks(tasks: Task[], filter: FilterType): Task[] {
  switch (filter) {
    case 'active':
      return tasks.filter((task) => !task.completed);
    case 'completed':
      return tasks.filter((task) => task.completed);
    case 'all':
    default:
      return tasks;
  }
}

export function getTaskStats(tasks: Task[]): TaskStats {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  return {
    total,
    completed,
    active: total - completed,
  };
}
