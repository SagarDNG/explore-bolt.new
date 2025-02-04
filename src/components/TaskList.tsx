import React from 'react';
import { CheckCircle, Clock, Trash2, Edit2 } from 'lucide-react';
import type { Task } from '../types/Task';
import { deleteTask, updateTask } from '../api/tasks';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export function TaskList({ tasks, onTaskUpdated, onTaskDeleted }: TaskListProps) {
  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    try {
      const updatedTask = await updateTask(task._id, { status: newStatus });
      onTaskUpdated(updatedTask);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      onTaskDeleted(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
              <p className="mt-1 text-gray-600">{task.description}</p>
              {task.dueDate && (
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              <button
                onClick={() => handleStatusChange(task, 'completed')}
                className="p-1 text-green-600 hover:text-green-800"
                title="Mark as completed"
              >
                <CheckCircle className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="p-1 text-red-600 hover:text-red-800"
                title="Delete task"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}