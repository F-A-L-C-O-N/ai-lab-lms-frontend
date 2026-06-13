import React, { useState } from 'react';
import { Plus, Trash, Code, X } from 'lucide-react';

export default function ChallengeForm({ codingChallenges = [], onChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Temporary form states for the new coding challenge being created in the modal
  const [description, setDescription] = useState('');
  const [initialCode, setInitialCode] = useState('def solution():\n    # Write your code here\n    pass');
  const [testCases, setTestCases] = useState([{ input: '', expected: '' }]);

  const updateChallenges = (newChallenges) => {
    onChange(newChallenges);
  };

  const openModal = () => {
    setDescription('');
    setInitialCode('def solution():\n    # Write your code here\n    pass');
    setTestCases([{ input: '', expected: '' }]);
    setIsModalOpen(true);
  };

  const handleAddModalTestCase = () => {
    setTestCases([...testCases, { input: '', expected: '' }]);
  };

  const handleRemoveModalTestCase = (tIdx) => {
    if (testCases.length <= 1) return;
    setTestCases(testCases.filter((_, idx) => idx !== tIdx));
  };

  const handleModalTestCaseChange = (tIdx, field, value) => {
    const newTestCases = [...testCases];
    let parsedVal = value;
    try {
      if (value.trim().startsWith('[') || value.trim().startsWith('{') || value.trim().startsWith('"')) {
        parsedVal = JSON.parse(value);
      } else if (value.trim() !== '' && !isNaN(value)) {
        parsedVal = Number(value);
      }
    } catch (_) {}

    newTestCases[tIdx] = { ...newTestCases[tIdx], [field]: parsedVal };
    setTestCases(newTestCases);
  };

  const saveChallenge = (e) => {
    e.preventDefault();
    const newChallenge = {
      description: description.trim() || 'Solve the challenge.',
      initialCode: initialCode,
      testCases: testCases
    };
    updateChallenges([...codingChallenges, newChallenge]);
    setIsModalOpen(false);
  };

  const removeChallenge = (cIdx) => {
    updateChallenges(codingChallenges.filter((_, idx) => idx !== cIdx));
  };

  const handleChallengeChange = (cIdx, field, value) => {
    const updated = [...codingChallenges];
    updated[cIdx] = { ...updated[cIdx], [field]: value };
    updateChallenges(updated);
  };

  const addTestCaseInline = (cIdx) => {
    const updated = [...codingChallenges];
    updated[cIdx] = {
      ...updated[cIdx],
      testCases: [...updated[cIdx].testCases, { input: '', expected: '' }]
    };
    updateChallenges(updated);
  };

  const removeTestCaseInline = (cIdx, tIdx) => {
    const updated = [...codingChallenges];
    const newTestCases = updated[cIdx].testCases.filter((_, idx) => idx !== tIdx);
    updated[cIdx] = { ...updated[cIdx], testCases: newTestCases };
    updateChallenges(updated);
  };

  const handleTestCaseChangeInline = (cIdx, tIdx, field, value) => {
    const updated = [...codingChallenges];
    const newTestCases = [...updated[cIdx].testCases];
    
    let parsedVal = value;
    try {
      if (value.trim().startsWith('[') || value.trim().startsWith('{') || value.trim().startsWith('"')) {
        parsedVal = JSON.parse(value);
      } else if (value.trim() !== '' && !isNaN(value)) {
        parsedVal = Number(value);
      }
    } catch (_) {}

    newTestCases[tIdx] = { ...newTestCases[tIdx], [field]: parsedVal };
    updated[cIdx] = { ...updated[cIdx], testCases: newTestCases };
    updateChallenges(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-base font-black text-text-primary dark:text-slate-200 flex items-center gap-2">
          <Code size={18} className="text-primary dark:text-indigo-400" />
          Coding Challenges (Python Sandbox)
        </h3>
        <button
          type="button"
          onClick={openModal}
          className="bg-primary hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={14} /> Add Challenge
        </button>
      </div>

      {codingChallenges.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-text-secondary dark:text-slate-400">
          No coding challenges added yet. Click "Add Challenge" to include python sandbox coding tasks.
        </div>
      ) : (
        <div className="space-y-6">
          {codingChallenges.map((item, cIdx) => (
            <div
              key={cIdx}
              className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 relative"
            >
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="text-[10px] font-black font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  Challenge #{cIdx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeChallenge(cIdx)}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                  title="Delete Challenge"
                >
                  <Trash size={15} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1">
                  Challenge Description / Instructions
                </label>
                <textarea
                  value={item.description}
                  onChange={(e) => handleChallengeChange(cIdx, 'description', e.target.value)}
                  rows="3"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1">
                  Initial Python Code Template
                </label>
                <textarea
                  value={item.initialCode}
                  onChange={(e) => handleChallengeChange(cIdx, 'initialCode', e.target.value)}
                  rows="4"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-mono text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Test Cases */}
              <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">
                    Execution Test Cases
                  </h4>
                  <button
                    type="button"
                    onClick={() => addTestCaseInline(cIdx)}
                    className="border border-primary/40 hover:border-primary dark:border-indigo-500/40 text-primary dark:text-indigo-400 px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus size={12} /> Add Test Case
                  </button>
                </div>

                <div className="space-y-3">
                  {item.testCases.map((tc, tIdx) => {
                    const rawInputVal = typeof tc.input === 'object' ? JSON.stringify(tc.input) : String(tc.input);
                    const rawExpectedVal = typeof tc.expected === 'object' ? JSON.stringify(tc.expected) : String(tc.expected);

                    return (
                      <div key={tIdx} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-xl p-3 relative">
                        <button
                          type="button"
                          onClick={() => removeTestCaseInline(cIdx, tIdx)}
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                          disabled={item.testCases.length <= 1}
                        >
                          <Trash size={13} />
                        </button>

                        <div>
                          <label className="block text-[10px] font-bold text-text-secondary dark:text-slate-500 uppercase tracking-wider mb-1">
                            Input Value (e.g. "Alice" or 5)
                          </label>
                          <input
                            type="text"
                            value={rawInputVal}
                            onChange={(e) => handleTestCaseChangeInline(cIdx, tIdx, 'input', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-text-secondary dark:text-slate-500 uppercase tracking-wider mb-1">
                            Expected Output (e.g. "Hello, Alice!" or 10)
                          </label>
                          <input
                            type="text"
                            value={rawExpectedVal}
                            onChange={(e) => handleTestCaseChangeInline(cIdx, tIdx, 'expected', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Challenge Modal Overlay Card */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={saveChallenge}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-150"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-text-primary dark:text-slate-200">
                Add Coding Challenge
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase mb-1">
                Challenge Instructions
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                placeholder="e.g. Write a function add(a, b) that returns the sum."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase mb-1">
                Initial Python Code template
              </label>
              <textarea
                value={initialCode}
                onChange={(e) => setInitialCode(e.target.value)}
                rows="4"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-mono text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                required
              />
            </div>

            {/* Test Cases inside modal */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase">
                  Test Cases
                </label>
                <button
                  type="button"
                  onClick={handleAddModalTestCase}
                  className="text-primary dark:text-indigo-400 hover:underline font-bold text-[10px] flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus size={10} /> Add Test Case
                </button>
              </div>

              <div className="space-y-3">
                {testCases.map((tc, tIdx) => {
                  const rawInputVal = typeof tc.input === 'object' ? JSON.stringify(tc.input) : String(tc.input);
                  const rawExpectedVal = typeof tc.expected === 'object' ? JSON.stringify(tc.expected) : String(tc.expected);

                  return (
                    <div key={tIdx} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 relative">
                      {testCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveModalTestCase(tIdx)}
                          className="absolute top-1 right-2 text-slate-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                        >
                          <Trash size={13} />
                        </button>
                      )}

                      <div>
                        <label className="block text-[10px] font-bold text-text-secondary dark:text-slate-500 uppercase tracking-wider mb-1">
                          Input Value
                        </label>
                        <input
                          type="text"
                          value={rawInputVal}
                          onChange={(e) => handleModalTestCaseChange(tIdx, 'input', e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                          placeholder="e.g. 5"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-text-secondary dark:text-slate-500 uppercase tracking-wider mb-1">
                          Expected Output
                        </label>
                        <input
                          type="text"
                          value={rawExpectedVal}
                          onChange={(e) => handleModalTestCaseChange(tIdx, 'expected', e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                          placeholder="e.g. 10"
                          required
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-text-primary dark:text-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
              >
                Save & Add Challenge
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
