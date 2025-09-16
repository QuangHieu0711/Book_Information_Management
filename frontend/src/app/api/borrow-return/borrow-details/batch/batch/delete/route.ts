import { NextRequest, NextResponse } from 'next/server';
import { CONST_API } from '../../../../../constants';

export async function DELETE(req: NextRequest) {
  const authToken = req.cookies.get('authToken')?.value;
  if (!authToken) return NextResponse.json({ status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!' }, { status: 401 });

  const body = await req.json();
  const res = await fetch(`${CONST_API}/borrow-details/batch/delete`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
