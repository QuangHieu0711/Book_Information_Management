import { NextRequest, NextResponse } from 'next/server';
import { CONST_API } from '../../constants';

// Lấy danh sách phiếu mượn
export async function GET(req: NextRequest) {
  const authToken = req.cookies.get('authToken')?.value;

  if (!authToken) {
    return NextResponse.json(
      { status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!', data: [] },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${CONST_API}/borrows`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    // Nếu backend trả về lỗi
    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { status: false, userMessage: errorData.userMessage || 'Không lấy được danh sách phiếu mượn', data: [] },
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

// Thêm mới phiếu mượn
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
    const url = `${CONST_API}/borrows?userId=${body.userId}`;

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
  } catch (err) {
    return NextResponse.json(
      { status: false, userMessage: 'Có lỗi kết nối server backend' },
      { status: 500 }
    );
  }
}
