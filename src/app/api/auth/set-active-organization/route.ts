import { auth } from '@/lib/auth';
import { setActiveOrganization } from '@/features/organization/server/service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { organizationId } = await req.json();

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organizationId is required' },
        { status: 400 }
      );
    }

    // 获取当前会话
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 更新会话的 activeOrganizationId
    await setActiveOrganization(session.session.token, organizationId);

    return NextResponse.json(
      { message: 'Active organization updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error setting active organization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}