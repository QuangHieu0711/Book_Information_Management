import { NextRequest, NextResponse } from 'next/server';
import { CONST_API } from '../../constants';

export async function GET(req: NextRequest) {
  const authToken = req.cookies.get('authToken')?.value;
  const url = new URL(req.url);
  const borrowId = url.searchParams.get('borrowId');

  if (!authToken) return NextResponse.json({ status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!', data: [] }, { status: 401 });
  if (!borrowId) return NextResponse.json({ status: false, userMessage: 'Thiếu tham số borrowId', data: [] }, { status: 400 });

  const res = await fetch(`${CONST_API}/borrow-details?borrowId=${borrowId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${authToken}` },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
