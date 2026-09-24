type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <nav
      aria-label='Applications pagination'
      className='flex flex-wrap items-center justify-center gap-4'
    >
      <button
        type='button'
        aria-label='Go to first page'
        title='First page'
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        className='rounded-md border border-line-strong px-3 py-2 text-sm font-medium hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-50'
      >
        &laquo;
      </button>
      <button
        type='button'
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className='rounded-md border border-line-strong px-3 py-2 text-sm font-medium hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-50'
      >
        Previous
      </button>

      <span className='text-sm text-muted'>
        Page {currentPage} of {totalPages}
      </span>

      <button
        type='button'
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className='rounded-md border border-line-strong px-3 py-2 text-sm font-medium hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-50'
      >
        Next
      </button>
      <button
        type='button'
        aria-label='Go to last page'
        title='Last page'
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
        className='rounded-md border border-line-strong px-3 py-2 text-sm font-medium hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-50'
      >
        &raquo;
      </button>
    </nav>
  );
}
