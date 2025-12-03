import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { locale } = await request.json();

    // 验证 locale 是否有效
    const supportedLocales = ['en', 'zh'];
    if (!supportedLocales.includes(locale)) {
      return NextResponse.json(
        { error: 'Unsupported locale' },
        { status: 400 },
      );
    }

    // 创建响应并设置 cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('locale', locale, {
      maxAge: 60 * 60 * 24 * 365, // 1 年
      httpOnly: false, // 允许客户端访问
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.log(
      'Locale API Error:',
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
