'use client';

import { useEffect, useRef } from 'react';

import type { JobApplication } from '../types/application';

type DeleteApplicationDialogProps = {
  application: JobApplication | null;
  isDeleting: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteApplicationDialog({
  application,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: DeleteApplicationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (application && !dialog.open) {
      dialog.showModal();
    } else if (!application && dialog.open) {
      dialog.close();
    }
  }, [application]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      onCancel={(event) => {
        if (isDeleting) {
          event.preventDefault();
        }
      }}
      aria-label='Delete application'
      className='fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-lg border border-line bg-surface p-6 text-ink backdrop:bg-black/40'
    >
      <h2 className='text-xl font-semibold'>Delete application?</h2>
      <p className='mt-3 text-sm leading-6 text-muted'>
        Delete your application for{' '}
        <strong className='font-semibold text-ink'>
          {application?.position}
        </strong>{' '}
        at{' '}
        <strong className='font-semibold text-ink'>
          {application?.company}
        </strong>
        ? This action cannot be undone.
      </p>

      {error && (
        <p
          role='alert'
          className='mt-4 rounded-md border border-danger-line bg-danger-soft p-3 text-sm text-danger-text'
        >
          {error}
        </p>
      )}

      <div className='mt-6 flex flex-wrap justify-end gap-3'>
        <button
          type='button'
          disabled={isDeleting}
          onClick={onCancel}
          className='min-h-11 rounded-md border border-line-strong px-4 py-2 text-sm font-medium text-secondary hover:bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-50'
        >
          Cancel
        </button>

        <button
          type='button'
          disabled={isDeleting}
          onClick={onConfirm}
          className='min-h-11 rounded-md border border-danger-line bg-danger-soft px-4 py-2 text-sm font-semibold text-danger-text hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger-text disabled:cursor-wait disabled:opacity-50'
        >
          {isDeleting ? 'Deleting...' : 'Delete application'}
        </button>
      </div>
    </dialog>
  );
}
