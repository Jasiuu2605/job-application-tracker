import { ImageResponse } from 'next/og';

export const alt =
  'Job Application Tracker: applications, interviews and follow-ups in one place.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#111214',
          color: '#f4f4f5',
          padding: '48px 64px',
          borderLeft: '12px solid #5eead4',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 54,
              height: 54,
              borderRadius: 8,
              background: '#0f766e',
              color: '#ffffff',
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            JT
          </div>
          <span style={{ fontSize: 22, color: '#acb1bb' }}>A clearer picture of your job search</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 38, fontSize: 76, lineHeight: 1.08, fontWeight: 700 }}>
          <span>Job Application</span>
          <span>Tracker</span>
        </div>

        <div style={{ display: 'flex', marginTop: 24, maxWidth: 950, fontSize: 28, lineHeight: 1.4, color: '#d7dbe2' }}>
          Your applications, interviews and next steps.
          Together in one place.
        </div>

        <div style={{ display: 'flex', gap: 14, marginTop: 'auto' }}>
          {[
            { label: 'Applications', background: '#202f49', color: '#a6c8ff' },
            { label: 'Interviews', background: '#1c303c', color: '#8bd6f5' },
            { label: 'Offers', background: '#1b342b', color: '#86efac' },
            { label: 'Follow-ups', background: '#382f1c', color: '#fcd478' },
          ].map(({ label, background, color }) => (
            <div key={label} style={{ display: 'flex', padding: '12px 20px', borderRadius: 8, fontSize: 21, background, color }}>
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
