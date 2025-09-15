import { NextRequest, NextResponse } from 'next/server';

// Sửa thông tin người dùng
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const authToken = req.cookies.get('authToken')?.value;
  const { id } = params;

  if (!authToken) {
    return NextResponse.json(
      { status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    // body: { username, role, fullName }

    const res = await fetch(`http://localhost:8081/api/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { status: false, userMessage: 'Có lỗi kết nối server backend' },
      { status: 500 }
    );
  }
}

// Xóa người dùng
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authToken = req.cookies.get('authToken')?.value;
  const { id } = params;

  if (!authToken) {
    return NextResponse.json(
      { status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!' },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`http://localhost:8081/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + authToken,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { status: false, userMessage: 'Có lỗi kết nối server backend' },
      { status: 500 }
    );
  }
}
