import { NextRequest, NextResponse } from 'next/server';

// Lấy chi tiết nhà xuất bản
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const authToken = req.cookies.get('authToken')?.value;
  const { id } = params;

  if (!authToken) {
    return NextResponse.json(
      { status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!', data: null },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`http://localhost:8081/api/publishers/${id}`, {
      headers: { 'Authorization': 'Bearer ' + authToken },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { status: false, userMessage: 'Có lỗi kết nối server backend', data: null },
      { status: 500 }
    );
  }
}

// Sửa thông tin nhà xuất bản
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authToken = req.cookies.get('authToken')?.value;
  const { id } = params;

  if (!authToken) {
    return NextResponse.json({ status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const res = await fetch(`http://localhost:8081/api/publishers/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ status: false, userMessage: 'Có lỗi kết nối server backend' }, { status: 500 });
  }
}

// Xóa nhà xuất bản
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authToken = req.cookies.get('authToken')?.value;
  const { id } = params;

  if (!authToken) {
    return NextResponse.json({ status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!' }, { status: 401 });
  }

  try {
    const res = await fetch(`http://localhost:8081/api/publishers/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + authToken }
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ status: false, userMessage: 'Có lỗi kết nối server backend' }, { status: 500 });
  }
}
