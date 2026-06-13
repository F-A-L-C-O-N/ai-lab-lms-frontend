import React, { useState } from 'react';
import { Plus, Trash, HelpCircle, X } from 'lucide-react';

export default function QuizForm({ quiz = [], onChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Temporary form states for the new question being created in the modal
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);

  const updateQuiz = (newQuiz) => {
    onChange(newQuiz);
  };

  const openModal = () => {
    setQuestionText('');
    setOptions(['', '', '']);
    setCorrectIndex(0);
    setIsModalOpen(true);
  };

  const handleAddModalOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveModalOption = (oIdx) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, idx) => idx !== oIdx);
    setOptions(newOptions);
    if (correctIndex >= newOptions.length) {
      setCorrectIndex(Math.max(0, newOptions.length - 1));
    }
  };

  const handleModalOptionChange = (oIdx, val) => {
    const newOptions = [...options];
    newOptions[oIdx] = val;
    setOptions(newOptions);
  };

  const saveQuestion = (e) => {
    e.preventDefault();
    const cleanOptions = options.map(o => o.trim() || 'Option');
    const newQuestion = {
      question: questionText.trim() || 'New Question',
      options: cleanOptions,
      answerIndex: correctIndex
    };
    updateQuiz([...quiz, newQuestion]);
    setIsModalOpen(false);
  };

  const removeQuestion = (qIdx) => {
    updateQuiz(quiz.filter((_, idx) => idx !== qIdx));
  };

  const handleQuestionTextChange = (qIdx, value) => {
    const updated = [...quiz];
    updated[qIdx] = { ...updated[qIdx], question: value };
    updateQuiz(updated);
  };

  const handleOptionChange = (qIdx, optIdx, value) => {
    const updated = [...quiz];
    const newOptions = [...updated[qIdx].options];
    newOptions[optIdx] = value;
    updated[qIdx] = { ...updated[qIdx], options: newOptions };
    updateQuiz(updated);
  };

  const handleAddOptionInline = (qIdx) => {
    const updated = [...quiz];
    const newOptions = [...updated[qIdx].options, ''];
    updated[qIdx] = { ...updated[qIdx], options: newOptions };
    updateQuiz(updated);
  };

  const handleRemoveOptionInline = (qIdx, optIdx) => {
    const updated = [...quiz];
    const newOptions = updated[qIdx].options.filter((_, idx) => idx !== optIdx);
    let newAnswerIdx = updated[qIdx].answerIndex;
    if (newAnswerIdx >= newOptions.length) {
      newAnswerIdx = Math.max(0, newOptions.length - 1);
    }
    updated[qIdx] = { ...updated[qIdx], options: newOptions, answerIndex: newAnswerIdx };
    updateQuiz(updated);
  };

  const handleAnswerIndexChange = (qIdx, value) => {
    const updated = [...quiz];
    updated[qIdx] = { ...updated[qIdx], answerIndex: parseInt(value, 10) };
    updateQuiz(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-base font-black text-text-primary dark:text-slate-200 flex items-center gap-2">
          <HelpCircle size={18} className="text-primary dark:text-indigo-400" />
          Quiz Questions
        </h3>
        <button
          type="button"
          onClick={openModal}
          className="bg-primary hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={14} /> Add Question
        </button>
      </div>

      {quiz.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-text-secondary dark:text-slate-400">
          No quiz questions added yet. Click "Add Question" to attach a practice quiz to this milestone.
        </div>
      ) : (
        <div className="space-y-6">
          {quiz.map((item, qIdx) => (
            <div
              key={qIdx}
              className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 relative"
            >
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="text-[10px] font-black font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  Q{qIdx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIdx)}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                  title="Delete Question"
                >
                  <Trash size={15} />
                </button>
              </div>

              <div className="pr-12">
                <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1">
                  Question Text
                </label>
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">
                    Answer Options & Key
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddOptionInline(qIdx)}
                    className="text-primary dark:text-indigo-400 hover:underline font-bold text-[10px] flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus size={10} /> Add Option
                  </button>
                </div>

                <div className="space-y-2">
                  {item.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`correct-ans-${qIdx}`}
                        checked={item.answerIndex === oIdx}
                        onChange={() => handleAnswerIndexChange(qIdx, oIdx)}
                        className="cursor-pointer h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-800"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                        className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-1.5 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                      />
                      {item.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionInline(qIdx, oIdx)}
                          className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                        >
                          <Trash size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/40">
                  <span className="text-[11px] font-bold text-text-secondary dark:text-slate-400">
                    Correct Option Index:
                  </span>
                  <select
                    value={item.answerIndex}
                    onChange={(e) => handleAnswerIndexChange(qIdx, e.target.value)}
                    className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-2 py-1 rounded-lg text-xs font-bold text-text-primary dark:text-slate-300 focus:border-primary focus:outline-none"
                  >
                    {item.options.map((_, oIdx) => (
                      <option key={oIdx} value={oIdx}>
                        Option {oIdx + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Question Modal Overlay Card */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={saveQuestion}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-150"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-text-primary dark:text-slate-200">
                Add Quiz Question
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
                Question Text
              </label>
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                placeholder="e.g. Which of the following is mutable in Python?"
                required
              />
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase">
                  Answer Options & Correct Key Selection
                </label>
                <button
                  type="button"
                  onClick={handleAddModalOption}
                  className="text-primary dark:text-indigo-400 hover:underline font-bold text-[10px] flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus size={10} /> Add Option
                </button>
              </div>

              <div className="space-y-2">
                {options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="modal-correct-choice"
                      checked={correctIndex === oIdx}
                      onChange={() => setCorrectIndex(oIdx)}
                      className="cursor-pointer h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-850"
                      title="Mark as correct answer"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleModalOptionChange(oIdx, e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                      placeholder={`Option ${oIdx + 1}`}
                      required
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveModalOption(oIdx)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                      >
                        <Trash size={13} />
                      </button>
                    )}
                  </div>
                ))}
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
                Save & Add Question
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
