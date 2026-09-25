import Link from 'next/link';

export default function NotFound() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-canvas px-6 text-ink'>
      <div className='max-w-md text-center'>
        <p className='text-sm font-semibold text-accent'>404</p>
        <h1 className='mt-3 text-3xl font-semibold'>Page not found</h1>
        <p className='mt-4 text-sm leading-6 text-muted'>
          This page does not exist or has been moved.
        </p>
        <div className='mt-6 flex flex-wrap justify-center gap-3'>
          <Link
            href='/dashboard'
            className='inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
          >
            Open tracker
          </Link>

          <Link
            href='/'
            className='inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong px-5 py-3 text-sm font-medium text-secondary transition-colors hover:bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
