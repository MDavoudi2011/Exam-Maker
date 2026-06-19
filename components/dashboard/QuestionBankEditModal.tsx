import React, { useState } from 'react';
import { Edit, Loader2, ChevronDown } from 'lucide-react';
import { toFarsiNumber, isEnglishText } from '@/utils/text.util';
import { useEditModal } from '@/hooks/useQuestionBankTab';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { FilterDropdown } from '@/components/ui/FilterDropdown';

export function EditModal({ question, topics, onClose, onSave }: { question: any, topics: string[], onClose: () => void, onSave: () => void }) {
  const [topicOpen, setTopicOpen] = useState(false);
  const {
    content,
    setContent,
    options,
    setOptions,
    correctIndex,
    setCorrectIndex,
    topic,
    setTopic,
    score,
    setScore,
    loading,
    handleSave,
  } = useEditModal(question, onSave, onClose);

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalHeader 
        title={question.id ? 'ویرایش سوال' : 'افزودن سوال جدید'} 
        icon={Edit} 
        onClose={onClose} 
      />
 
      <ModalBody>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">عنوان سوال</label>
          <textarea 
            className="w-full p-4 rounded-xl border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium min-h-[100px] resize-y outline-none text-foreground"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="متن سوال را اینجا بنویسید..."
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">گزینه‌ها (گزینه صحیح را تیک بزنید)</label>
          {options.map((opt, idx) => {
            const isEnglish = isEnglishText(opt);
            return (
              <div key={idx} className="flex items-center gap-3">
                <input 
                  type="radio"
                  name="edit-correct"
                  checked={correctIndex === idx}
                  onChange={() => setCorrectIndex(idx)}
                  className="w-5 h-5 text-success border-input focus:ring-success mt-1 cursor-pointer bg-background"
                />
                <input 
                  type="text"
                  value={opt}
                  dir={isEnglish ? "ltr" : "rtl"}
                  onChange={e => {
                    const newOpts = [...options];
                    newOpts[idx] = e.target.value;
                    setOptions(newOpts);
                  }}
                  placeholder={`گزینه ${toFarsiNumber(idx + 1)}`}
                  className={`flex-1 p-3 outline-none rounded-xl border transition-all text-sm font-medium ${correctIndex === idx ? 'border-success/50 bg-success/10 focus:border-success focus:ring-2 focus:ring-success/20' : 'border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground'} ${isEnglish ? 'text-left' : ''}`}
                />
              </div>
            )})}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">موضوع</label>
            <FilterDropdown
              value={topic || ''}
              options={[{ value: '', label: 'بدون موضوع' }, ...topics.map(t => ({ value: t, label: t }))]}
              onChange={setTopic}
              isOpen={topicOpen}
              onToggle={() => setTopicOpen(!topicOpen)}
              onClose={() => setTopicOpen(false)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">نمره</label>
            <input 
              type="number"
              min={0.5}
              step={0.5}
              value={score}
              onChange={e => setScore(parseFloat(e.target.value))}
              className="w-full outline-none p-3 rounded-xl border border-input bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold text-left text-foreground"
              dir="ltr"
            />
          </div>
        </div>
      </ModalBody>
 
      <ModalFooter>
        <button 
          onClick={handleSave} 
          disabled={loading || !content.trim()}
          className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          ذخیره سوال
        </button>
        <button 
          onClick={onClose}
          className="px-6 bg-secondary text-secondary-foreground py-3 rounded-xl font-bold hover:bg-secondary/80 transition-all border border-border"
        >
          انصراف
        </button>
      </ModalFooter>
    </Modal>
  );
}
