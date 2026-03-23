"use client";

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Search, Plus, MoreHorizontal } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

const dummyNotes: Note[] = [
  {
    id: '1',
    title: 'Shopping List',
    content: 'Milk, Eggs, Bread, Butter, Cheese, Apples, Bananas, Orange juice, Coffee, Sugar...',
    date: 'Today',
  },
  {
    id: '2',
    title: 'Meeting Notes',
    content: 'Discussed Q4 targets and marketing strategy. Action items: Follow up with design team...',
    date: 'Yesterday',
  },
  {
    id: '3',
    title: 'Recipe Ideas',
    content: 'Pasta carbonara, Chicken stir fry, Vegetable soup, Grilled salmon, Caesar salad...',
    date: 'Oct 28',
  },
  {
    id: '4',
    title: 'Travel Plans',
    content: 'Flight at 9 AM, Hotel check-in at 2 PM, Meeting at 4 PM, Dinner reservation at 7 PM...',
    date: 'Oct 25',
  },
];

export function StealthNotesScreen() {
  const { setCurrentScreen, updateSettings } = useApp();
  const [notes] = useState<Note[]>(dummyNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [titlePressCount, setTitlePressCount] = useState(0);
  const [titlePressTimer, setTitlePressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleTitlePress = () => {
    if (titlePressTimer) {
      clearTimeout(titlePressTimer);
    }

    const newCount = titlePressCount + 1;
    setTitlePressCount(newCount);

    if (newCount >= 3) {
      // Unlock THADAM
      updateSettings({ stealthMode: false });
      setCurrentScreen('home');
      setTitlePressCount(0);
      return;
    }

    const timer = setTimeout(() => {
      setTitlePressCount(0);
    }, 1000);
    setTitlePressTimer(timer);
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#1C1C1E]">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <button className="text-[#0A84FF] text-lg">
            {'< Folders'}
          </button>
          <button onClick={handleTitlePress}>
            <MoreHorizontal className="w-6 h-6 text-[#0A84FF]" />
          </button>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Notes</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full px-4 py-2 pl-10 rounded-xl bg-[#2C2C2E] text-white placeholder:text-gray-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Notes Count */}
      <div className="px-4 py-2">
        <span className="text-gray-500 text-sm">{filteredNotes.length} Notes</span>
      </div>

      {/* Notes List */}
      <div className="px-4">
        {filteredNotes.map((note, index) => (
          <div key={note.id}>
            <div className="py-3">
              <h3 className="text-white font-semibold mb-1">{note.title}</h3>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">{note.date}</span>
                <span className="text-gray-500 text-sm truncate">{note.content}</span>
              </div>
            </div>
            {index < filteredNotes.length - 1 && (
              <div className="h-px bg-[#3A3A3C] ml-0" />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] border-t border-[#3A3A3C] px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">{notes.length} Notes</span>
          <button className="w-10 h-10 rounded-full bg-[#0A84FF] flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Hidden unlock hint (invisible but tappable on title) */}
      <button
        onClick={handleTitlePress}
        className="absolute top-16 left-4 w-20 h-10 opacity-0"
        aria-label="Unlock THADAM"
      />
    </div>
  );
}
