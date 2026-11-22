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

export const MAX_TITLE_LENGTH = 100;

export function getTitleError(title: string): string | null {
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return 'Title cannot be empty.';
  }
  if (trimmed.length > MAX_TITLE_LENGTH) {
    return 'Title must be 100 characters or fewer.';
  }
  return null;
}

export function isTitleValid(title: string): boolean {
  return getTitleError(title) === null;
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
  const titleError = getTitleError(title);
  if (titleError) {
    throw new Error(titleError);
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
