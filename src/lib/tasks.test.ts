import { describe, it, expect, vi } from 'vitest';
import {
  createTask,
  toggleTask,
  deleteTask,
  filterTasks,
  getTaskStats,
  isTitleValid,
  getTitleError,
  MAX_TITLE_LENGTH,
  type Task,
} from './tasks';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Write report',
    priority: 'medium',
    completed: false,
    ...overrides,
  };
}

describe('isTitleValid', () => {
  it('accepts a normal title', () => {
    expect(isTitleValid('Buy groceries')).toBe(true);
  });

  it('rejects an empty title', () => {
    expect(isTitleValid('')).toBe(false);
  });

  it('rejects a whitespace-only title', () => {
    expect(isTitleValid('    ')).toBe(false);
  });

  it('rejects a title longer than 100 characters', () => {
    expect(isTitleValid('a'.repeat(101))).toBe(false);
  });

  it('accepts a title of exactly 100 characters', () => {
    expect(isTitleValid('a'.repeat(100))).toBe(true);
  });
});

describe('getTitleError', () => {
  it('returns null for a valid title', () => {
    expect(getTitleError('Buy groceries')).toBeNull();
  });

  it('returns the empty message for an empty or whitespace-only title', () => {
    expect(getTitleError('')).toBe('Title cannot be empty.');
    expect(getTitleError('   ')).toBe('Title cannot be empty.');
  });

  it('returns the length message for a title over 100 characters', () => {
    expect(getTitleError('a'.repeat(MAX_TITLE_LENGTH + 1))).toBe(
      'Title must be 100 characters or fewer.'
    );
  });

  it('returns null for a title of exactly 100 characters', () => {
    expect(getTitleError('a'.repeat(MAX_TITLE_LENGTH))).toBeNull();
  });
});

describe('createTask', () => {
  it('creates a task with the given title and priority', () => {
    const task = createTask('Review pull request', 'high');
    expect(task.title).toBe('Review pull request');
    expect(task.priority).toBe('high');
    expect(task.completed).toBe(false);
    expect(task.id).toBeTruthy();
  });

  it('trims whitespace from the title', () => {
    const task = createTask('  Trim me  ', 'low');
    expect(task.title).toBe('Trim me');
  });

  it('includes a tag when one is provided', () => {
    const task = createTask('Deploy app', 'high', '  ops  ');
    expect(task.tag).toBe('ops');
  });

  it('omits the tag field when none is provided', () => {
    const task = createTask('Read docs', 'low');
    expect(task.tag).toBeUndefined();
  });

  it('omits the tag field when tag is whitespace-only', () => {
    const task = createTask('Read docs', 'low', '   ');
    expect(task.tag).toBeUndefined();
  });

  it('throws on an empty title', () => {
    expect(() => createTask('', 'medium')).toThrow();
  });

  it('throws on a whitespace-only title', () => {
    expect(() => createTask('   ', 'medium')).toThrow();
  });

  it('throws on a title longer than 100 characters', () => {
    expect(() => createTask('a'.repeat(101), 'medium')).toThrow();
  });

  it('generates a fallback id when crypto.randomUUID is missing', () => {
    const original = globalThis.crypto;
    // @ts-expect-error - intentionally deleting crypto to simulate non-secure context
    delete globalThis.crypto;
    try {
      const task = createTask('Fallback id test', 'low');
      expect(task.id).toBeTruthy();
      expect(typeof task.id).toBe('string');
      expect(task.id.length).toBeGreaterThan(0);
    } finally {
      globalThis.crypto = original;
    }
  });

  it('generates a fallback id when crypto.randomUUID throws', () => {
    const original = globalThis.crypto;
    const fakeCrypto = {
      ...original,
      randomUUID: vi.fn(() => {
        throw new Error('not in secure context');
      }),
    };
    globalThis.crypto = fakeCrypto as Crypto;
    try {
      const task = createTask('Fallback id throw test', 'low');
      expect(task.id).toBeTruthy();
      expect(typeof task.id).toBe('string');
      expect(task.id).not.toBe('');
    } finally {
      globalThis.crypto = original;
    }
  });
});

describe('toggleTask', () => {
  it('toggles the matching task to completed', () => {
    const tasks = [makeTask({ id: '1', completed: false })];
    const result = toggleTask(tasks, '1');
    expect(result[0].completed).toBe(true);
  });

  it('toggles a completed task back to active', () => {
    const tasks = [makeTask({ id: '1', completed: true })];
    const result = toggleTask(tasks, '1');
    expect(result[0].completed).toBe(false);
  });

  it('leaves other tasks unchanged', () => {
    const tasks = [
      makeTask({ id: '1', completed: false }),
      makeTask({ id: '2', completed: false }),
    ];
    const result = toggleTask(tasks, '1');
    expect(result[1].completed).toBe(false);
  });

  it('returns the same list length when id is not found', () => {
    const tasks = [makeTask({ id: '1' })];
    const result = toggleTask(tasks, 'missing');
    expect(result).toHaveLength(1);
    expect(result[0].completed).toBe(false);
  });
});

describe('deleteTask', () => {
  it('removes the task with the matching id', () => {
    const tasks = [
      makeTask({ id: '1' }),
      makeTask({ id: '2', title: 'Other' }),
    ];
    const result = deleteTask(tasks, '1');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('returns the full list when id is not found', () => {
    const tasks = [makeTask({ id: '1' })];
    const result = deleteTask(tasks, 'missing');
    expect(result).toHaveLength(1);
  });

  it('does not mutate the original list', () => {
    const tasks = [makeTask({ id: '1' })];
    deleteTask(tasks, '1');
    expect(tasks).toHaveLength(1);
  });
});

describe('filterTasks', () => {
  const tasks: Task[] = [
    makeTask({ id: '1', completed: false, title: 'Active one' }),
    makeTask({ id: '2', completed: true, title: 'Done one' }),
    makeTask({ id: '3', completed: false, title: 'Active two' }),
  ];

  it('returns all tasks for the "all" filter', () => {
    expect(filterTasks(tasks, 'all')).toHaveLength(3);
  });

  it('returns only active tasks for the "active" filter', () => {
    const result = filterTasks(tasks, 'active');
    expect(result).toHaveLength(2);
    expect(result.every((t) => !t.completed)).toBe(true);
  });

  it('returns only completed tasks for the "completed" filter', () => {
    const result = filterTasks(tasks, 'completed');
    expect(result).toHaveLength(1);
    expect(result[0].completed).toBe(true);
  });

  it('returns an empty array when no tasks match', () => {
    expect(filterTasks([], 'completed')).toHaveLength(0);
  });
});

describe('getTaskStats', () => {
  it('counts total, active, and completed correctly', () => {
    const tasks: Task[] = [
      makeTask({ id: '1', completed: false }),
      makeTask({ id: '2', completed: true }),
      makeTask({ id: '3', completed: true }),
      makeTask({ id: '4', completed: false }),
      makeTask({ id: '5', completed: false }),
    ];
    expect(getTaskStats(tasks)).toEqual({
      total: 5,
      active: 3,
      completed: 2,
    });
  });

  it('returns zeros for an empty list', () => {
    expect(getTaskStats([])).toEqual({ total: 0, active: 0, completed: 0 });
  });

  it('returns all completed when every task is done', () => {
    const tasks: Task[] = [
      makeTask({ id: '1', completed: true }),
      makeTask({ id: '2', completed: true }),
    ];
    expect(getTaskStats(tasks)).toEqual({ total: 2, active: 0, completed: 2 });
  });
});
