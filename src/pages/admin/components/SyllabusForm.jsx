import React, { useState } from 'react';
import { Plus, Trash, BookOpen, X, ChevronDown, ChevronRight } from 'lucide-react';

export default function SyllabusForm({ subtopics = [], onChange }) {
  const [isSubtopicModalOpen, setIsSubtopicModalOpen] = useState(false);
  const [isSubsubtopicModalOpen, setIsSubsubtopicModalOpen] = useState(false);
  const [activeSubtopicIdx, setActiveSubtopicIdx] = useState(null);

  // Form states for Subtopic Modal
  const [subId, setSubId] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [subHeading, setSubHeading] = useState('');
  const [subContent, setSubContent] = useState('');
  const [subYT, setSubYT] = useState('');
  const [subCode, setSubCode] = useState('');

  // Form states for Sub-subtopic Modal
  const [ssId, setSsId] = useState('');
  const [ssTitle, setSsTitle] = useState('');
  const [ssHeading, setSsHeading] = useState('');
  const [ssContent, setSsContent] = useState('');
  const [ssYT, setSsYT] = useState('');
  const [ssCode, setSsCode] = useState('');

  const updateSubtopics = (newSubtopics) => {
    onChange(newSubtopics);
  };

  const openAddSubtopicModal = () => {
    const nextIdx = subtopics.length + 1;
    setSubId(`1.${nextIdx}`);
    setSubTitle('');
    setSubHeading('');
    setSubContent('');
    setSubYT('');
    setSubCode('');
    setIsSubtopicModalOpen(true);
  };

  const saveSubtopic = (e) => {
    e.preventDefault();
    const newSub = {
      id: subId.trim() || `1.${subtopics.length + 1}`,
      title: subTitle.trim() || 'New Subtopic',
      heading: subHeading.trim(),
      content: subContent.trim(),
      YT_link: subYT.trim(),
      code: subCode.trim(),
      subsubtopics: []
    };
    updateSubtopics([...subtopics, newSub]);
    setIsSubtopicModalOpen(false);
  };

  const openAddSubsubtopicModal = (sIdx) => {
    setActiveSubtopicIdx(sIdx);
    const sub = subtopics[sIdx];
    const subsubList = sub.subsubtopics || [];
    const nextIdx = subsubList.length + 1;
    setSsId(`${sub.id}.${nextIdx}`);
    setSsTitle('');
    setSsHeading('');
    setSsContent('');
    setSsYT('');
    setSsCode('');
    setIsSubsubtopicModalOpen(true);
  };

  const saveSubsubtopic = (e) => {
    e.preventDefault();
    if (activeSubtopicIdx === null) return;
    const newSS = {
      id: ssId.trim(),
      title: ssTitle.trim() || 'New Sub-subtopic',
      heading: ssHeading.trim(),
      content: ssContent.trim(),
      YT_link: ssYT.trim(),
      code: ssCode.trim()
    };
    const updated = [...subtopics];
    const sub = updated[activeSubtopicIdx];
    updated[activeSubtopicIdx] = {
      ...sub,
      subsubtopics: [...(sub.subsubtopics || []), newSS]
    };
    updateSubtopics(updated);
    setIsSubsubtopicModalOpen(false);
    setActiveSubtopicIdx(null);
  };

  const removeSubtopic = (index) => {
    updateSubtopics(subtopics.filter((_, idx) => idx !== index));
  };

  const handleSubtopicChange = (index, field, value) => {
    const updated = [...subtopics];
    updated[index] = { ...updated[index], [field]: value };
    updateSubtopics(updated);
  };

  const removeSubSubtopic = (subtopicIdx, subSubIdx) => {
    const sub = subtopics[subtopicIdx];
    const updatedSubSub = (sub.subsubtopics || []).filter((_, idx) => idx !== subSubIdx);
    const updated = [...subtopics];
    updated[subtopicIdx] = { ...sub, subsubtopics: updatedSubSub };
    updateSubtopics(updated);
  };

  const handleSubSubtopicChange = (subtopicIdx, subSubIdx, field, value) => {
    const sub = subtopics[subtopicIdx];
    const updatedSubSub = [...(sub.subsubtopics || [])];
    updatedSubSub[subSubIdx] = { ...updatedSubSub[subSubIdx], [field]: value };
    const updated = [...subtopics];
    updated[subtopicIdx] = { ...sub, subsubtopics: updatedSubSub };
    updateSubtopics(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-base font-black text-text-primary dark:text-slate-200 flex items-center gap-2">
          <BookOpen size={18} className="text-primary dark:text-indigo-400" />
          Syllabus Structure (Subtopics & Sub-subtopics)
        </h3>
        <button
          type="button"
          onClick={openAddSubtopicModal}
          className="bg-primary hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={14} /> Add Subtopic
        </button>
      </div>

      {/* List section */}
      {subtopics.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-text-secondary dark:text-slate-400">
          No subtopics added yet. Click "Add Subtopic" to begin building the syllabus structure.
        </div>
      ) : (
        <div className="space-y-6">
          {subtopics.map((sub, sIdx) => (
            <div
              key={sIdx}
              className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 relative"
            >
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => removeSubtopic(sIdx)}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                  title="Delete Subtopic"
                >
                  <Trash size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-10">
                <div>
                  <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1">
                    Subtopic ID (e.g. 1.1)
                  </label>
                  <input
                    type="text"
                    value={sub.id}
                    onChange={(e) => handleSubtopicChange(sIdx, 'id', e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1">
                    Subtopic Title
                  </label>
                  <input
                    type="text"
                    value={sub.title}
                    onChange={(e) => handleSubtopicChange(sIdx, 'title', e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1">
                    Lesson Heading
                  </label>
                  <input
                    type="text"
                    value={sub.heading || ''}
                    onChange={(e) => handleSubtopicChange(sIdx, 'heading', e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1">
                    YouTube Lesson Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={sub.YT_link || ''}
                    onChange={(e) => handleSubtopicChange(sIdx, 'YT_link', e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1">
                  Lesson Content (Markdown / Text)
                </label>
                <textarea
                  value={sub.content || ''}
                  onChange={(e) => handleSubtopicChange(sIdx, 'content', e.target.value)}
                  rows="3"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1">
                  Code Snippet (Optional)
                </label>
                <textarea
                  value={sub.code || ''}
                  onChange={(e) => handleSubtopicChange(sIdx, 'code', e.target.value)}
                  rows="2"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-mono text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Sub-subtopics Section */}
              <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4 mt-2">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">
                    Sub-subtopics of {sub.title || sub.id}
                  </h4>
                  <button
                    type="button"
                    onClick={() => openAddSubsubtopicModal(sIdx)}
                    className="border border-primary/40 hover:border-primary dark:border-indigo-500/40 text-primary dark:text-indigo-400 px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus size={12} /> Add Sub-subtopic
                  </button>
                </div>

                <div className="space-y-3 pl-4 border-l-2 border-slate-200 dark:border-slate-800">
                  {(sub.subsubtopics || []).map((ss, ssIdx) => (
                    <div
                      key={ssIdx}
                      className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-855 rounded-xl p-4 space-y-3 relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeSubSubtopic(sIdx, ssIdx)}
                        className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors cursor-pointer"
                        title="Delete Sub-subtopic"
                      >
                        <Trash size={13} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-8">
                        <div>
                          <label className="block text-[10px] font-bold text-text-secondary dark:text-slate-500 uppercase tracking-wider mb-0.5">
                            ID (e.g. 1.1.1)
                          </label>
                          <input
                            type="text"
                            value={ss.id}
                            onChange={(e) => handleSubSubtopicChange(sIdx, ssIdx, 'id', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 px-2 py-1.5 rounded-lg text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-text-secondary dark:text-slate-500 uppercase tracking-wider mb-0.5">
                            Sub-subtopic Title
                          </label>
                          <input
                            type="text"
                            value={ss.title}
                            onChange={(e) => handleSubSubtopicChange(sIdx, ssIdx, 'title', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 px-2 py-1.5 rounded-lg text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-text-secondary dark:text-slate-500 uppercase tracking-wider mb-0.5">
                            Heading
                          </label>
                          <input
                            type="text"
                            value={ss.heading || ''}
                            onChange={(e) => handleSubSubtopicChange(sIdx, ssIdx, 'heading', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 px-2 py-1.5 rounded-lg text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-text-secondary dark:text-slate-500 uppercase tracking-wider mb-0.5">
                            YouTube Video (Optional)
                          </label>
                          <input
                            type="text"
                            value={ss.YT_link || ''}
                            onChange={(e) => handleSubSubtopicChange(sIdx, ssIdx, 'YT_link', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 px-2 py-1.5 rounded-lg text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-text-secondary dark:text-slate-500 uppercase tracking-wider mb-0.5">
                          Lesson Content
                        </label>
                        <textarea
                          value={ss.content || ''}
                          onChange={(e) => handleSubSubtopicChange(sIdx, ssIdx, 'content', e.target.value)}
                          rows="2"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 px-2 py-1.5 rounded-lg text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-text-secondary dark:text-slate-500 uppercase tracking-wider mb-0.5">
                          Code Snippet (Optional)
                        </label>
                        <textarea
                          value={ss.code || ''}
                          onChange={(e) => handleSubSubtopicChange(sIdx, ssIdx, 'code', e.target.value)}
                          rows="1"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 px-2 py-1.5 rounded-lg text-[11px] font-mono text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                  {(sub.subsubtopics || []).length === 0 && (
                    <div className="text-[11px] italic text-text-secondary dark:text-slate-500 py-1">
                      No sub-subtopics added.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtopic Modal Overlay Card */}
      {isSubtopicModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={saveSubtopic}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-150"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-text-primary dark:text-slate-200">
                Add Subtopic
              </h3>
              <button
                type="button"
                onClick={() => setIsSubtopicModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase mb-1">
                  ID Index
                </label>
                <input
                  type="text"
                  value={subId}
                  onChange={(e) => setSubId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase mb-1">
                  Subtopic Title
                </label>
                <input
                  type="text"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                  placeholder="e.g. Introduction to Lists"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase mb-1">
                  Lesson Heading
                </label>
                <input
                  type="text"
                  value={subHeading}
                  onChange={(e) => setSubHeading(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                  placeholder="e.g. Python lists explanation"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase mb-1">
                  YT Link (Optional)
                </label>
                <input
                  type="text"
                  value={subYT}
                  onChange={(e) => setSubYT(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                  placeholder="https://youtube.com/watch?..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase mb-1">
                Lesson Content details
              </label>
              <textarea
                value={subContent}
                onChange={(e) => setSubContent(e.target.value)}
                rows="3"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                placeholder="Write lesson study material..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase mb-1">
                Python Code Snippet (Optional)
              </label>
              <textarea
                value={subCode}
                onChange={(e) => setSubCode(e.target.value)}
                rows="2"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-mono text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                placeholder="my_list = [1, 2, 3]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSubtopicModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-text-primary dark:text-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
              >
                Save & Add Subtopic
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sub-subtopic Modal Overlay Card */}
      {isSubsubtopicModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={saveSubsubtopic}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-150"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-text-primary dark:text-slate-200">
                Add Sub-subtopic
              </h3>
              <button
                type="button"
                onClick={() => setIsSubsubtopicModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase mb-1">
                  ID Index
                </label>
                <input
                  type="text"
                  value={ssId}
                  onChange={(e) => setSsId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase mb-1">
                  Sub-subtopic Title
                </label>
                <input
                  type="text"
                  value={ssTitle}
                  onChange={(e) => setSsTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                  placeholder="e.g. List indexing"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase mb-1">
                  Heading
                </label>
                <input
                  type="text"
                  value={ssHeading}
                  onChange={(e) => setSsHeading(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                  placeholder="e.g. Reading lists indexes"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase mb-1">
                  YT Video (Optional)
                </label>
                <input
                  type="text"
                  value={ssYT}
                  onChange={(e) => setSsYT(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                  placeholder="https://youtube.com/watch?..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase mb-1">
                Lesson Content
              </label>
              <textarea
                value={ssContent}
                onChange={(e) => setSsContent(e.target.value)}
                rows="3"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                placeholder="Write sub-subtopic explanation..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase mb-1">
                Code Snippet (Optional)
              </label>
              <textarea
                value={ssCode}
                onChange={(e) => setSsCode(e.target.value)}
                rows="2"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs font-mono text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                placeholder="my_list[0]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSubsubtopicModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-text-primary dark:text-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
              >
                Save & Add Sub-subtopic
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
