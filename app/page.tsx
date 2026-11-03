'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on client side
  useEffect(() => {
    setIsMounted(true);
    const savedTodos = localStorage.getItem('sb-next-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save to localStorage when change occurs
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('sb-next-todos', JSON.stringify(todos));
    }
  }, [todos, isMounted]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all tasks?')) {
      setTodos([]);
    }
  };

  // Filter computation
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          StackBlitz Task Manager
        </h1>

        {/* Input Form */}
        <form onSubmit={addTodo} className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
          >
            Add
          </button>
        </form>

        {/* Filter Controls & Analytics */}
        {todos.length > 0 && (
          <div className="flex flex-col gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="flex justify-center gap-2">
              {(['all', 'active', 'completed'] as FilterType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1 text-sm font-medium rounded-md capitalize transition ${
                    filter === type
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 px-1">
              <span>
                {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
              </span>
              <button
                onClick={clearAll}
                className="text-red-500 hover:text-red-700 font-medium transition"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Task Container Output */}
        <ul className="space-y-3">
          {filteredTodos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              {todos.length === 0
                ? 'No tasks yet. Add one above!'
                : 'No tasks match this filter.'}
            </p>
          ) : (
            filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span
                    className={`text-gray-700 break-words flex-1 ${
                      todo.completed ? 'line-through text-gray-400' : ''
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="ml-2 text-red-400 hover:text-red-600 font-medium px-2 py-1 rounded"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}
