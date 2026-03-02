import { useEffect, useState } from 'react';
import {
  Palette, Zap, BookOpen, FileText, StickyNote,
  ChevronRight, ArrowLeft, Eye, Globe, Tag,
  Clock, BarChart3, Info, Check
} from 'lucide-react';
import type { BreadcrumbItem } from '@/config/site';

interface CreatorStudioProps {
  onBreadcrumbChange?: (items: BreadcrumbItem[]) => void;
}

export default function CreatorStudio({ onBreadcrumbChange }: CreatorStudioProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'edit' | 'meta' | 'preview'>('select');
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const templates = [
    {
      id: 'quiz',
      title: 'Quiz',
      description: 'Create multiple-choice or short-answer quizzes for your peers',
      icon: Zap,
      color: '#059669',
      example: 'Test classmates on key concepts',
    },
    {
      id: 'flashcards',
      title: 'Flashcards',
      description: 'Build flashcard sets for vocabulary, formulas, or key facts',
      icon: StickyNote,
      color: '#1D4ED8',
      example: 'Study vocab, dates, formulas',
    },
    {
      id: 'explainer',
      title: 'Explainer Video Outline',
      description: 'Plan a short explainer video with script and talking points',
      icon: BookOpen,
      color: '#D97706',
      example: 'Teach a concept in 3–5 minutes',
    },
    {
      id: 'notes',
      title: 'Note Set',
      description: 'Organize and share your class notes in a structured format',
      icon: FileText,
      color: '#0369A1',
      example: 'Share lecture summaries',
    },
    {
      id: 'cheatsheet',
      title: 'Cheat Sheet',
      description: 'Create a one-page reference guide for a topic or exam',
      icon: BarChart3,
      color: '#7C3AED',
      example: 'Quick reference for exams',
    },
  ];

  useEffect(() => {
    if (!onBreadcrumbChange) return;
    if (selectedTemplate === null) {
      onBreadcrumbChange([]);
      return;
    }
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) {
      onBreadcrumbChange([]);
      return;
    }
    onBreadcrumbChange([{ label: template.title }, { label: step === 'select' ? 'Template' : step }]);
  }, [onBreadcrumbChange, selectedTemplate, step]);

  if (step !== 'select') {
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return null;
    const TemplateIcon = template.icon;

    return (
      <div className="creator-studio-page space-y-6">
        <button
          onClick={() => { setStep('select'); setSelectedTemplate(null); }}
          className="inline-flex items-center gap-2 text-sm text-[#1D4ED8] font-medium min-h-[44px] underline"
        >
          <ArrowLeft size={16} /> Back to templates
        </button>

        {/* Step indicator */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            {[
              { id: 'edit', label: 'Create Content' },
              { id: 'meta', label: 'Add Details' },
              { id: 'preview', label: 'Preview & Publish' },
            ].map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  step === s.id
                    ? 'bg-[#1D4ED8] text-white'
                    : (
                      (step === 'meta' && i === 0) || (step === 'preview' && i <= 1)
                        ? 'bg-[#059669] text-white'
                        : 'bg-gray-100 text-[#4B5563]'
                    )
                }`}>
                  {(step === 'meta' && i === 0) || (step === 'preview' && i <= 1) ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step === s.id ? 'text-[#1D4ED8]' : 'text-[#4B5563]'}`}>{s.label}</span>
                {i < 2 && <div className="flex-1 h-px bg-gray-200 mx-2 hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        {step === 'edit' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: template.color + '15' }}>
                  <TemplateIcon size={16} style={{ color: template.color }} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#111827]">{template.title}</h2>
                  <p className="text-xs text-[#4B5563]">{template.description}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#111827] block mb-1">Title *</label>
                    <input
                      type="text"
                      placeholder={`Enter your ${template.title.toLowerCase()} title...`}
                      className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#111827] placeholder-[#4B5563] border border-transparent focus:border-[#1D4ED8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 min-h-[48px]"
                    />
                  </div>

                  {selectedTemplate === 'quiz' && (
                    <>
                      <div className="p-4 bg-[#F5F5F7] rounded-xl">
                        <label className="text-sm font-medium text-[#111827] block mb-2">Question 1</label>
                        <input
                          type="text"
                          placeholder="Enter your question..."
                          className="w-full px-4 py-2.5 bg-white rounded-lg text-sm border border-gray-200 focus:border-[#1D4ED8] focus:outline-none min-h-[44px] mb-3"
                        />
                        <div className="space-y-2">
                          {['A', 'B', 'C', 'D'].map(opt => (
                            <div key={opt} className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-medium text-[#4B5563]">{opt}</span>
                              <input
                                type="text"
                                placeholder={`Option ${opt}...`}
                                className="flex-1 px-3 py-2 bg-white rounded-lg text-sm border border-gray-200 focus:border-[#1D4ED8] focus:outline-none min-h-[40px]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <button className="inline-flex items-center gap-2 text-sm text-[#1D4ED8] font-medium min-h-[44px]">
                        + Add another question
                      </button>
                    </>
                  )}

                  {selectedTemplate === 'flashcards' && (
                    <>
                      <div className="p-4 bg-[#F5F5F7] rounded-xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-[#4B5563] block mb-1">Front (term)</label>
                            <textarea placeholder="Enter term or question..." className="w-full px-3 py-2.5 bg-white rounded-lg text-sm border border-gray-200 focus:border-[#1D4ED8] focus:outline-none min-h-[80px] resize-y" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-[#4B5563] block mb-1">Back (definition)</label>
                            <textarea placeholder="Enter definition or answer..." className="w-full px-3 py-2.5 bg-white rounded-lg text-sm border border-gray-200 focus:border-[#1D4ED8] focus:outline-none min-h-[80px] resize-y" />
                          </div>
                        </div>
                      </div>
                      <button className="inline-flex items-center gap-2 text-sm text-[#1D4ED8] font-medium min-h-[44px]">
                        + Add another card
                      </button>
                    </>
                  )}

                  {(selectedTemplate === 'explainer' || selectedTemplate === 'notes' || selectedTemplate === 'cheatsheet') && (
                    <div>
                      <label className="text-sm font-medium text-[#111827] block mb-1">Content</label>
                      <textarea
                        placeholder={`Write your ${template.title.toLowerCase()} content here...`}
                        className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#111827] placeholder-[#4B5563] border border-transparent focus:border-[#1D4ED8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 min-h-[200px] resize-y"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setStep('meta')}
                    className="inline-flex items-center gap-2 bg-[#1D4ED8] text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-[#1E40AF] transition-colors min-h-[48px]"
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Tips sidebar */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 h-fit">
              <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2 mb-3">
                <Info size={16} className="text-[#0369A1]" /> Tips
              </h3>
              <ul className="space-y-2 text-xs text-[#4B5563]">
                <li className="flex items-start gap-2"><span className="text-[#0369A1]">•</span> Keep questions clear and concise</li>
                <li className="flex items-start gap-2"><span className="text-[#0369A1]">•</span> Add explanations to help learners understand</li>
                <li className="flex items-start gap-2"><span className="text-[#0369A1]">•</span> Use specific examples when possible</li>
                <li className="flex items-start gap-2"><span className="text-[#0369A1]">•</span> Review your content before publishing</li>
              </ul>
            </div>
          </div>
        )}

        {step === 'meta' && (
          <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100 max-w-2xl">
            <h2 className="text-base font-bold text-[#111827] mb-4">Resource Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#111827] block mb-1">
                    <Tag size={14} className="inline mr-1" /> Subject *
                  </label>
                  <select className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm border border-transparent focus:border-[#1D4ED8] focus:outline-none min-h-[48px]">
                    <option>Select subject</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                    <option>Earth Science</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#111827] block mb-1">
                    <BarChart3 size={14} className="inline mr-1" /> Difficulty
                  </label>
                  <select className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm border border-transparent focus:border-[#1D4ED8] focus:outline-none min-h-[48px]">
                    <option>Select difficulty</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>All Levels</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827] block mb-1">
                  <Clock size={14} className="inline mr-1" /> Estimated Time
                </label>
                <select className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm border border-transparent focus:border-[#1D4ED8] focus:outline-none min-h-[48px]">
                  <option>Select time</option>
                  <option>Under 5 minutes</option>
                  <option>5–10 minutes</option>
                  <option>10–20 minutes</option>
                  <option>20+ minutes</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827] block mb-1">Tags</label>
                <input
                  type="text"
                  placeholder="Add tags separated by commas..."
                  className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#111827] placeholder-[#4B5563] border border-transparent focus:border-[#1D4ED8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 min-h-[48px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827] block mb-1">Notes for other students (optional)</label>
                <textarea
                  placeholder="Any tips or context for students using this resource..."
                  className="w-full px-4 py-3 bg-[#F5F5F7] rounded-xl text-sm text-[#111827] placeholder-[#4B5563] border border-transparent focus:border-[#1D4ED8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 min-h-[80px] resize-y"
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep('edit')}
                className="inline-flex items-center gap-2 border border-gray-200 text-[#111827] font-medium px-5 py-3 rounded-xl text-sm hover:bg-[#F5F5F7] min-h-[48px]"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={() => setStep('preview')}
                className="inline-flex items-center gap-2 bg-[#1D4ED8] text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-[#1E40AF] transition-colors min-h-[48px]"
              >
                Preview <Eye size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100">
              <h2 className="text-base font-bold text-[#111827] mb-4 flex items-center gap-2">
                <Eye size={18} className="text-[#1D4ED8]" /> Preview
              </h2>
              <div className="bg-[#F5F5F7] rounded-xl p-6 text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: template.color + '15' }}>
                  <TemplateIcon size={28} style={{ color: template.color }} />
                </div>
                <h3 className="text-lg font-bold text-[#111827]">Your {template.title}</h3>
                <p className="text-sm text-[#4B5563] mt-1">Preview of how your resource will appear to other learners</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="px-2 py-0.5 bg-[#1D4ED8]/10 text-[#1D4ED8] rounded text-[10px] font-semibold">{template.title}</span>
                  <span className="px-2 py-0.5 bg-gray-200 text-[#4B5563] rounded text-[10px] font-medium">Physics</span>
                  <span className="px-2 py-0.5 bg-gray-200 text-[#4B5563] rounded text-[10px] font-medium">Beginner</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep('meta')}
                className="inline-flex items-center gap-2 border border-gray-200 text-[#111827] font-medium px-5 py-3 rounded-xl text-sm hover:bg-[#F5F5F7] min-h-[48px]"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={() => setShowPublishConfirm(true)}
                className="inline-flex items-center gap-2 bg-[#059669] text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-[#047857] transition-colors min-h-[48px] shadow-sm"
              >
                <Globe size={16} /> Publish
              </button>
            </div>

            {showPublishConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40" onClick={() => setShowPublishConfirm(false)} />
                <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-[#059669]/10 flex items-center justify-center mx-auto mb-3">
                      <Globe size={24} className="text-[#059669]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#111827]">Publish Resource?</h3>
                    <p className="text-sm text-[#4B5563] mt-2">
                      This will be <strong>public to other learners</strong> on the platform. They'll be able to view, use, and comment on your resource.
                    </p>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowPublishConfirm(false)}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-[#111827] hover:bg-[#F5F5F7] min-h-[48px]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { setShowPublishConfirm(false); setStep('select'); setSelectedTemplate(null); }}
                      className="flex-1 px-4 py-3 bg-[#059669] text-white rounded-xl text-sm font-semibold hover:bg-[#047857] min-h-[48px]"
                    >
                      Publish
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="creator-studio-page space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-[#111827]">Creator Studio</h1>
        <p className="text-sm text-[#4B5563] mt-0.5">Create resources to share with your classmates</p>
      </div>

      <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100">
        <h2 className="text-base font-bold text-[#111827] mb-1">Choose a Template</h2>
        <p className="text-sm text-[#4B5563] mb-5">Pick a format to start creating</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => {
            const Icon = template.icon;
            return (
              <button
                key={template.id}
                onClick={() => { setSelectedTemplate(template.id); setStep('edit'); }}
                className="p-5 rounded-xl border-2 border-gray-100 hover:border-[#1D4ED8] hover:shadow-md transition-all text-left group min-h-[48px]"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors" style={{ backgroundColor: template.color + '12' }}>
                  <Icon size={24} style={{ color: template.color }} />
                </div>
                <h3 className="text-base font-semibold text-[#111827]">{template.title}</h3>
                <p className="text-xs text-[#4B5563] mt-1">{template.description}</p>
                <p className="text-[10px] text-[#4B5563] mt-2 italic">e.g., {template.example}</p>
                <div className="flex items-center gap-1 mt-3 text-[#1D4ED8] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Start creating <ChevronRight size={14} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent creations */}
      <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100">
        <h2 className="text-base font-bold text-[#111827] mb-4 flex items-center gap-2">
          <Palette size={18} className="text-[#1D4ED8]" /> Your Creations
        </h2>
        <div className="space-y-2">
          {[
            { title: 'Kinematics Basics Quiz', type: 'Quiz', date: '3 days ago', views: 24, color: '#059669' },
            { title: 'Organic Chemistry Flashcards', type: 'Flashcards', date: '1 week ago', views: 18, color: '#1D4ED8' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#F5F5F7]/50 hover:bg-[#F5F5F7] transition-colors">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.color + '12' }}>
                <Palette size={16} style={{ color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#111827]">{item.title}</div>
                <div className="text-xs text-[#4B5563]">{item.type} · {item.date} · {item.views} views</div>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
