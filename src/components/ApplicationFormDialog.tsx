import { useEffect, useRef, type ReactNode } from 'react';

type ApplicationFormDialogProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function ApplicationFormDialog({
  isOpen,
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

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onClose={onClose}
      className='fixed inset-0 m-auto h-dvh max-h-dvh w-full max-w-none overflow-y-auto border-0 bg-white p-0 backdrop:bg-black/40 sm:h-auto sm:max-h-[90dvh] sm:max-w-[720px] sm:rounded-lg'
    >
      <div className='flex items-center justify-between gap-4 px-6 pt-4'>
        <h2 className='text-xl font-semibold text-slate-950'>{title}</h2>

        <button
          type='button'
          aria-label='Close application form'
          title='Close'
          onClick={() => dialogRef.current?.close()}
          className='flex h-10 w-10 items-center justify-center rounded-md text-2xl text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600'
        >
          &times;
        </button>
      </div>
      {children}
    </dialog>
  );
}
