import React, { useEffect } from 'react';
import { act, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { TaskProvider, useTaskContext } from './TaskContext';

vi.mock('../common/utils/DataHydrationService', () => ({
  DataHydrationService: {
    shouldHydrate: () => true,
    getInitialTasks: () => [
      { id: 1, title: 'One', isCompleted: false },
      { id: 2, title: 'Two', isCompleted: false },
      { id: 3, title: 'Three', isCompleted: false }
    ]
  }
}));

function Probe() {
  const { tasks, stats, completeAllTasks, deleteCompletedTasks } =
    useTaskContext();

  useEffect(() => {
    window.taskActions = { completeAllTasks, deleteCompletedTasks };
  }, [completeAllTasks, deleteCompletedTasks]);

  return (
    <div>
      <span data-testid="completed">{stats.completed}</span>
      <span data-testid="task-count">{tasks.length}</span>
    </div>
  );
}

describe('TaskContext bulk operations', () => {
  test('completes and deletes a selected set of tasks', async () => {
    render(
      <TaskProvider>
        <Probe />
      </TaskProvider>
    );

    await act(async () => {
      window.taskActions.completeAllTasks([1, 3]);
    });

    expect(screen.getByTestId('completed')).toHaveTextContent('2');

    await act(async () => {
      window.taskActions.deleteCompletedTasks([1]);
    });

    expect(screen.getByTestId('task-count')).toHaveTextContent('2');
  });
});
