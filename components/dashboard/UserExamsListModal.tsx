'use client';
import React from 'react';
import { Eye, BookOpen } from 'lucide-react';
import { Modal, ModalHeader, ModalBody } from '@/components/ui/Modal';
import { toFarsiNumber } from '@/utils/text.util';
import { ActionButtonGroup, ActionButton } from '@/components/ui/ActionButton';
import { useUserExamsListModal } from '@/hooks/useUserExamsListModal';

import { ScoreBadge } from '@/components/ui/ScoreBadge';

export function UserExamsListModal({
  user,
  exams,
  onClose,
  onViewAttempt
}: {
  user: any;
  exams: any[];
  onClose: () => void;
  onViewAttempt: (attemptId: string) => void;
}) {
  const { attemptsWithDetails } = useUserExamsListModal(user, exams);

  if (!user) return null;

  return (
    <Modal isOpen={true} onClose={onClose} maxWidth="max-w-5xl">
      <ModalHeader title={`لیست آزمون‌های ${user.fullName || 'کاربر'}`} icon={BookOpen} onClose={onClose} />
      <ModalBody className="p-0 md:p-0 space-y-0 text-xs md:text-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-right border-collapse min-w-max md:min-w-[800px]">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground border-b border-border">
                <th className="p-3 md:p-4 font-semibold px-4 md:px-6">عنوان آزمون</th>
                <th className="p-3 md:p-4 font-semibold text-center whitespace-nowrap">سازنده آزمون</th>
                <th className="p-3 md:p-4 font-semibold text-center w-36 whitespace-nowrap">تاریخ شروع</th>
                <th className="p-3 md:p-4 font-semibold text-center w-36 whitespace-nowrap">تاریخ پایان</th>
                <th className="p-3 md:p-4 font-semibold text-center w-24">نمره</th>
                <th className="p-3 md:p-4 font-semibold text-center w-28 px-4 md:px-6">ریز نتایج</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs md:text-sm">
              {attemptsWithDetails.map((attempt: any) => {
                return (
                  <tr key={attempt.id} className="hover:bg-muted/50 transition-colors group">
                    <td className="p-3 md:p-4 font-bold text-foreground px-4 md:px-6">
                      {attempt.examTitle}
                    </td>
                    <td className="p-3 md:p-4 text-center text-muted-foreground whitespace-nowrap">
                      {attempt.creatorName}
                    </td>
                    <td className="p-3 md:p-4 text-muted-foreground text-[10px] md:text-sm text-center whitespace-nowrap" dir="ltr">
                      {attempt.startedAt}
                    </td>
                    <td className="p-3 md:p-4 text-muted-foreground text-[10px] md:text-sm text-center whitespace-nowrap" dir="ltr">
                      {attempt.completedAt}
                    </td>
                    <td className="p-3 md:p-4 text-center">
                      <ScoreBadge score={attempt.score} />
                    </td>
                    <td className="p-2 md:p-4 px-4 md:px-6 text-center whitespace-nowrap">
                      <ActionButtonGroup>
                        <ActionButton 
                          onClick={() => onViewAttempt(attempt.id)} 
                          icon={Eye} 
                          title="مشاهده ریز نتایج" 
                          color="sky" 
                        />
                      </ActionButtonGroup>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ModalBody>
    </Modal>
  );
}
