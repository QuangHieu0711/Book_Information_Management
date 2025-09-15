import { NextRequest, NextResponse } from 'next/server';

// Lấy danh sách nhà xuất bản
export async function GET(req: NextRequest) {
  const authToken = req.cookies.get('authToken')?.value;

  if (!authToken) {
    return NextResponse.json(
      { status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!', data: [] },
      { status: 401 }
    );
  }

  try {
    const res = await fetch('http://localhost:8081/api/publishers', {
      headers: { 'Authorization': 'Bearer ' + authToken },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { status: false, userMessage: 'Có lỗi kết nối server backend', data: [] },
      { status: 500 }
    );
  }
}

// Thêm mới nhà xuất bản
export async function POST(req: NextRequest) {
  const authToken = req.cookies.get('authToken')?.value;

  if (!authToken) {
    return NextResponse.json(
      { status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const res = await fetch('http://localhost:8081/api/publishers', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { status: false, userMessage: 'Có lỗi kết nối server backend' },
      { status: 500 }
    );
  }
}
