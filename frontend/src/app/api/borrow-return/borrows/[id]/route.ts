import { NextRequest, NextResponse } from 'next/server';
import { CONST_API } from '../../../constants';

// PUT: Cập nhật phiếu mượn theo id truyền vào qua URL
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const authToken = req.cookies.get('authToken')?.value;
  if (!authToken)
    return NextResponse.json(
      { status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!' },
      { status: 401 }
    );
  const id = context.params.id;
  const body = await req.json();

  const res = await fetch(`${CONST_API}/borrows/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// DELETE: Xóa phiếu mượn theo id truyền vào qua URL
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const authToken = req.cookies.get('authToken')?.value;
  if (!authToken)
    return NextResponse.json(
      { status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!' },
      { status: 401 }
    );
  const id = context.params.id;

  const res = await fetch(`${CONST_API}/borrows/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
