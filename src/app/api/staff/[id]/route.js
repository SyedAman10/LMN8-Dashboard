import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { deactivateStaff } from '@/lib/staffAuth';

export async function DELETE(request, { params }) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await deactivateStaff(params.id, auth.clinicianId);
    return NextResponse.json({ message: 'Staff deactivated successfully' });
  } catch (error) {
    console.error('Delete staff error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
