import { getAdminAuth, getAdminDb } from '@/src/lib/firebase-admin';
import type { JobApplication } from '@/src/types/application';
import { applicationsToCsv } from '@/src/utils/applicationsCsv';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const authorization = request.headers.get('Authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return Response.json(
      { error: 'Authentication required.' },
      { status: 401 },
    );
  }

  const token = authorization.slice('Bearer '.length).trim();

  if (!token) {
    return Response.json(
      { error: 'Authentication required.' },
      { status: 401 },
    );
  }

  const adminAuth = getAdminAuth();

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);

    try {
      const snapshot = await getAdminDb()
        .collection('users')
        .doc(decodedToken.uid)
        .collection('applications')
        .get();

      const applications = snapshot.docs.map(
        (document) =>
          ({
            ...document.data(),
            id: document.id,
          }) as JobApplication,
      );

      const csv = applicationsToCsv(applications);

      return new Response(`\uFEFF${csv}`, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="job-applications.csv"',
          'Cache-Control': 'no-store',
        },
      });
    } catch {
      return Response.json(
        { error: 'Could not load applications.' },
        { status: 500 },
      );
    }
  } catch {
    return Response.json(
      { error: 'Invalid or expired token.' },
      { status: 401 },
    );
  }
}
