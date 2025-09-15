import { NextRequest, NextResponse } from 'next/server';

// Lấy danh sách sách
export async function GET(req: NextRequest) {
  const authToken = req.cookies.get('authToken')?.value;

  if (!authToken) {
    return NextResponse.json(
      { status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!', data: [] },
      { status: 401 }
    );
  }

  try {
    const res = await fetch('http://localhost:8081/api/books', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + authToken
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { status: false, userMessage: errorData.userMessage || 'Không lấy được danh sách sách', data: [] },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { status: false, userMessage: 'Có lỗi kết nối server backend', data: [] },
      { status: 500 }
    );
  }
}

// Thêm mới sách
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
    // body: { title, authorName, category, publisher, yearPublished, price, quantity, description, language, user, createdAt }

    const res = await fetch('http://localhost:8081/api/books', {
      method: 'POST',
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
