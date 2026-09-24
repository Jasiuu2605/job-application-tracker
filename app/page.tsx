import Image from 'next/image';
import Link from 'next/link';
import { ThemeSwitcher } from '@/src/components/ThemeSwitcher';
import { TrackerPreview } from '@/src/components/TrackerPreview';

const features = [
  {
    number: '01',
    title: 'Keep the whole picture.',
    description:
      'Company, role, salary, source and your own notes. Keep the details together so you can pick up exactly where you left off.',
    tag: 'Everything in one place',
    tone: 'text-accent',
  },
  {
    number: '02',
    title: 'Know where you stand.',
    description:
      'From a saved opportunity to an offer. Update your status as things move forward, then filter the list to focus on what matters today.',
    tag: 'Five recruitment statuses',
    tone: 'text-interview-text',
  },
  {
    number: '03',
    title: 'Remember the next step.',
    description:
      'Set a follow-up date and find applications that need your attention. Your notes are right there when it is time to get back in touch.',
    tag: 'Follow-ups and notes',
    tone: 'text-warning-text',
  },
];

const questions = [
  {
    question: 'Do I need an account?',
    answer:
      'Yes. Sign in with Google to save and manage your applications. Your entries are connected to your account, so you can return to them on another device.',
  },
  {
    question: 'Can other users see my applications?',
    answer:
      'Each account has its own application list. Access rules restrict users to their own entries; signing in with another account does not reveal your list.',
  },
  {
    question: 'Does the tracker send applications or follow-up emails?',
    answer:
      'No. You submit applications and contact companies yourself. The tracker records your progress and highlights follow-up dates inside the app; it does not send email reminders.',
  },
  {
    question: 'Can I use it on my phone?',
    answer:
      'Yes. The tracker works in your browser on desktop and mobile, with light, dark and system themes. Sign in with the same Google account to access your saved entries.',
  },
];

const primaryLink =
  'inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent';

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-canvas text-ink'>
      <a
        href='#about-content'
        className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-surface focus:p-3 focus:text-ink'
      >
        Skip to content
      </a>
      <header className='border-b border-line bg-surface'>
        <nav
          aria-label='Main navigation'
          className='mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8'
        >
          <Link href='/' className='text-sm font-semibold text-ink'>
            <span
              className='mr-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent text-xs text-on-accent'
              aria-hidden='true'
            >
              JT
            </span>
            Job Application Tracker
          </Link>
          <div className='flex flex-wrap items-center gap-4 sm:gap-6'>
            <a href='#features' className='text-sm text-muted hover:text-ink'>
              Features
            </a>
            <a href='#questions' className='text-sm text-muted hover:text-ink'>
              FAQ
            </a>
            <ThemeSwitcher />
          </div>
        </nav>
      </header>

      <main id='about-content'>
        <section className='relative isolate overflow-hidden bg-zinc-950 text-white'>
          <Image
            src='https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=2000&q=85'
            alt=''
            fill
            unoptimized
            preload
            sizes='100vw'
            className='-z-20 object-cover object-center'
          />
          <div className='absolute inset-0 -z-10 bg-black/75' />
          <div className='mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16'>
            <p className='mb-4 text-sm font-medium text-teal-200'>
              A little more order. A little less guesswork.
            </p>
            <h1 className='max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl'>
              Job Application Tracker
            </h1>
            <p className='mt-5 max-w-xl text-base leading-7 text-zinc-200 sm:text-lg'>
              Your job search has enough moving parts. Keep your applications,
              interviews and next steps together, from the first send to the
              final offer.
            </p>
            <div className='mt-7 flex flex-wrap items-center gap-5'>
              <Link
                href='/dashboard'
                className='inline-flex min-h-11 items-center justify-center rounded-md bg-teal-300 px-5 py-3 text-sm font-semibold text-teal-950 transition-colors hover:bg-teal-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-200'
              >
                Open tracker{' '}
                <span aria-hidden='true' className='ml-3'>
                  &rarr;
                </span>
              </Link>
              <a
                href='#preview'
                className='text-sm font-medium text-white underline decoration-white/40 underline-offset-4 hover:decoration-white'
              >
                Take a look inside
              </a>
            </div>
            <p className='mt-5 text-xs text-zinc-300'>
              Google sign-in. Your own application list. Available in your
              browser.
            </p>
          </div>
        </section>

        <section
          id='preview'
          aria-labelledby='preview-title'
          className='scroll-mt-6 border-b border-line'
        >
          <div className='mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14'>
            <div className='mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end'>
              <div>
                <p className='text-xs font-semibold uppercase text-accent'>
                  Less searching. More clarity.
                </p>
                <h2
                  id='preview-title'
                  className='mt-2 text-2xl font-semibold sm:text-3xl'
                >
                  Every opportunity, accounted for.
                </h2>
              </div>
              <p className='max-w-sm text-sm leading-6 text-muted'>
                A quick overview when you need it. The details when you want
                them.
              </p>
            </div>
            <TrackerPreview />
          </div>
        </section>

        <section
          id='features'
          aria-labelledby='features-title'
          className='scroll-mt-6 bg-surface'
        >
          <div className='mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16'>
            <h2
              id='features-title'
              className='text-2xl font-semibold sm:text-3xl'
            >
              Built around your next move.
            </h2>
            <div className='mt-8 grid gap-8 md:grid-cols-3 md:gap-10'>
              {features.map((feature) => (
                <div key={feature.number} className='border-t border-line pt-5'>
                  <span className={`font-mono text-sm ${feature.tone}`}>
                    {feature.number}
                  </span>
                  <h3 className='mt-4 text-lg font-semibold'>
                    {feature.title}
                  </h3>
                  <p className='mt-3 text-sm leading-7 text-muted'>
                    {feature.description}
                  </p>
                  <p className={`mt-5 text-xs font-medium ${feature.tone}`}>
                    {feature.tag}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby='workflow-title'
          className='border-y border-line bg-accent-soft'
        >
          <div className='mx-auto max-w-6xl px-5 py-12 sm:px-8'>
            <p className='text-xs font-semibold uppercase text-accent'>
              A simple routine
            </p>
            <h2 id='workflow-title' className='mt-2 text-2xl font-semibold'>
              Send. Save. Stay on top of it.
            </h2>
            <ol className='mt-8 grid gap-6 md:grid-cols-3'>
              {[
                [
                  'Save the opportunity',
                  'Add the company, role and the details worth remembering.',
                ],
                [
                  'Track the conversation',
                  'Update the status and keep notes as the recruitment moves forward.',
                ],
                [
                  'Plan your follow-up',
                  'Choose a date, then return to the entries that need attention.',
                ],
              ].map(([title, description], index) => (
                <li key={title} className='flex gap-4'>
                  <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent-line text-sm font-semibold text-accent'>
                    {index + 1}
                  </span>
                  <div>
                    <h3 className='text-sm font-semibold'>{title}</h3>
                    <p className='mt-2 text-sm leading-6 text-muted'>
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id='questions'
          aria-labelledby='questions-title'
          className='scroll-mt-6'
        >
          <div className='mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-[1fr_2fr] md:gap-16'>
            <div>
              <h2 id='questions-title' className='text-2xl font-semibold'>
                Before you start.
              </h2>
              <p className='mt-3 text-sm leading-6 text-muted'>
                A few things you might want to know.
              </p>
            </div>
            <div className='min-w-0 divide-y divide-line border-y border-line'>
              {questions.map(({ question, answer }) => (
                <details key={question} className='application-details py-1'>
                  <summary className='cursor-pointer py-4 pr-3 text-sm font-semibold marker:text-accent focus-visible:outline-2 focus-visible:outline-accent'>
                    {question}
                  </summary>
                  <p className='pb-5 text-sm leading-7 text-muted'>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className='border-t border-line bg-surface'>
          <div className='mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center sm:px-8'>
            <div>
              <h2 className='text-2xl font-semibold'>
                Make room for your next opportunity.
              </h2>
              <p className='mt-2 text-sm text-muted'>
                Start with the application you sent today.
              </p>
            </div>
            <Link href='/dashboard' className={`${primaryLink} shrink-0`}>
              Open tracker{' '}
              <span aria-hidden='true' className='ml-3'>
                &rarr;
              </span>
            </Link>
          </div>
        </section>
      </main>

      <footer className='border-t border-line'>
        <div className='mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-xs text-muted sm:px-8'>
          <span>Job Application Tracker</span>
          <div className='flex flex-wrap gap-5'>
            <a
              href='https://github.com/Jasiu2605/job-application-tracker'
              className='hover:text-ink'
            >
              Source on GitHub <span aria-hidden='true'>&nearr;</span>
            </a>
            <span>Workspace photo: Unsplash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
