'use client';

import { useState } from 'react';

interface BacklogItem {
  type: 'user story' | 'task' | 'bug' | 'technical debt';
  title: string;
  description: string;
  acceptanceCriteria: string[];
  storyPoints: number;
  priority: 'high' | 'medium' | 'low';
  humanPreparation: string[];
  aiPrompt: string;
}

interface BacklogViewProps {
  backlog: {
    id: string;
    phaseId: string;
    items: BacklogItem[];
  };
}

export function BacklogView({ backlog }: BacklogViewProps) {
  const [filter, setFilter] = useState<BacklogItem['type'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<BacklogItem['priority'] | 'all'>('all');
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);

  const filteredItems = backlog.items.filter(item => {
    if (filter !== 'all' && item.type !== filter) return false;
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
    return true;
  });

  const typeColors = {
    'user story': 'bg-blue-100 text-blue-800',
    'task': 'bg-green-100 text-green-800',
    'bug': 'bg-red-100 text-red-800',
    'technical debt': 'bg-purple-100 text-purple-800'
  };

  const priorityColors = {
    'high': 'bg-red-50 border-red-200',
    'medium': 'bg-yellow-50 border-yellow-200',
    'low': 'bg-green-50 border-green-200'
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Project Backlog</h1>
        
        <div className="flex gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as BacklogItem['type'] | 'all')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Types</option>
              <option value="user story">User Stories</option>
              <option value="task">Tasks</option>
              <option value="bug">Bugs</option>
              <option value="technical debt">Technical Debt</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as BacklogItem['priority'] | 'all')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredItems.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${priorityColors[item.priority]} shadow-sm`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[item.type]}`}>
                  {item.type}
                </span>
                <h3 className="text-lg font-medium">{item.title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {item.storyPoints} points
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.priority === 'high' ? 'bg-red-100 text-red-800' :
                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.priority}
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{item.description}</p>

            {item.acceptanceCriteria.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Acceptance Criteria:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {item.acceptanceCriteria.map((criteria, idx) => (
                    <li key={idx}>{criteria}</li>
                  ))}
                </ul>
              </div>
            )}

            {item.humanPreparation.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Human Preparation:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {item.humanPreparation.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4">
              <button
                onClick={() => setExpandedPrompt(expandedPrompt === item.aiPrompt ? null : item.aiPrompt)}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
              >
                <svg 
                  className={`w-4 h-4 mr-1 transition-transform ${expandedPrompt === item.aiPrompt ? 'rotate-90' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                {item.type === 'bug' ? 'AI Fix Guide' :
                 item.type === 'technical debt' ? 'AI Refactor Guide' :
                 item.type === 'task' ? 'AI Implementation Guide' :
                 'AI Development Guide'}
              </button>
              {expandedPrompt === item.aiPrompt && (
                <div className="mt-2 p-4 bg-gray-50 rounded-md">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {item.aiPrompt}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No items match the selected filters
        </div>
      )}
    </div>
  );
} 