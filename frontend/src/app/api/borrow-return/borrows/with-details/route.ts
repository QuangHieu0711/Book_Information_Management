import { NextRequest, NextResponse } from 'next/server';
import { CONST_API } from '../../../constants';

export async function POST(req: NextRequest) {
  const authToken = req.cookies.get('authToken')?.value;
  if (!authToken) return NextResponse.json({ status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!' }, { status: 401 });

  const body = await req.json();
  const url = `${CONST_API}/borrows/with-details?userId=${body.userId}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
