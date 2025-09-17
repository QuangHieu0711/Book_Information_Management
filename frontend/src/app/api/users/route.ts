import { NextRequest, NextResponse } from 'next/server';
import { CONST_API } from '../constants';

// Lấy danh sách người dùng
export async function GET(req: NextRequest) {
  const authToken = req.cookies.get('authToken')?.value;

  if (!authToken) {
    return NextResponse.json(
      { status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!', data: [] },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${CONST_API}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      // Nếu backend trả về lỗi, có thể không phải JSON
      let userMessage = 'Không lấy được danh sách người dùng';
      let errorData: any = {};
      try {
        errorData = await res.json();
        userMessage = errorData.userMessage || userMessage;
      } catch {
        // Nếu lỗi không phải JSON, giữ userMessage mặc định
      }
      return NextResponse.json(
        { status: false, userMessage, data: [] },
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

// Thêm mới người dùng
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

    const res = await fetch(`${CONST_API}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Xử lý lỗi backend
    if (!res.ok) {
      let userMessage = 'Không thêm được người dùng';
      let errorData: any = {};
      try {
        errorData = await res.json();
        userMessage = errorData.userMessage || userMessage;
      } catch {
        // Nếu lỗi không phải JSON, giữ userMessage mặc định
      }
      return NextResponse.json(
        { status: false, userMessage },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { status: false, userMessage: 'Có lỗi kết nối server backend' },
      { status: 500 }
    );
  }
}
