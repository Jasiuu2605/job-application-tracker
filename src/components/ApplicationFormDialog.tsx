import { useEffect, useRef, type ReactNode } from 'react';

type ApplicationFormDialogProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  isSaving: boolean;
};

export function ApplicationFormDialog({
  isOpen,
  isSaving,
  title,
  onClose,
  children,
}: ApplicationFormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }

    return () => {};
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.setAttribute('closedby', isSaving ? 'none' : 'closerequest');

    function handleCancel(event: Event) {
      if (isSaving) {
        event.preventDefault();
      }
    }

    dialog.addEventListener('cancel', handleCancel);

    return () => {
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [isSaving]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onClose={onClose}
      className='fixed inset-0 m-auto h-dvh max-h-dvh w-full max-w-none overflow-y-auto border-0 bg-surface p-0 backdrop:bg-black/40 sm:h-auto sm:max-h-[90dvh] sm:max-w-[720px] sm:rounded-lg'
    >
      <div className='flex items-center justify-between gap-4 px-6 pt-4'>
        <h2 className='text-xl font-semibold text-ink'>{title}</h2>

        <button
          type='button'
          aria-label='Close application form'
          title='Close'
          disabled={isSaving}
          onClick={() => dialogRef.current?.close()}
          className='flex h-10 w-10 items-center justify-center rounded-md text-2xl text-muted hover:bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-50'
        >
          &times;
        </button>
      </div>
      {children}
    </dialog>
  );
}
