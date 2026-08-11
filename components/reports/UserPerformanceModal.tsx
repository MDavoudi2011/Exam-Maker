'use client';

import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { ExamViewer } from '@/components/viewer/ExamViewer';
import { useAttemptDetails } from '@/hooks/useUsersPerformance';
import { Modal, ModalHeader, ModalBody } from '@/components/ui/Modal';

export function UserPerformanceModal({ attemptId, onClose }: { attemptId: string, onClose: () => void }) {
  const { details, examData, questions, loading } = useAttemptDetails(attemptId);

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalHeader 
        title={`ریز نتایج: ${details?.full_name || 'در حال بارگذاری...'}`}
        onClose={onClose}
      />
      <ModalBody className="p-0 sm:p-0">
        <div className="flex-1 w-full relative min-h-[60vh]">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : details && examData ? (
            <ExamViewer exam={examData} questions={questions} user={null} adminViewAttemptId={attemptId} />
          ) : (
            <p className="text-center text-muted-foreground p-10">اطلاعاتی یافت نشد</p>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}
