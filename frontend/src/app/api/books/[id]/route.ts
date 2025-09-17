import { NextRequest, NextResponse } from 'next/server';

// Lấy chi tiết sách
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const authToken = request.cookies.get('authToken')?.value;
    if (!authToken) {
      return NextResponse.json(
        { status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!', data: null },
        { status: 401 }
      );
    }

    const { id } = await Promise.resolve(context.params);
    const res = await fetch(`http://localhost:8081/api/books/${id}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + authToken
      }
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { status: false, userMessage: 'Có lỗi kết nối server backend', data: null },
      { status: 500 }
    );
  }
}

// Sửa thông tin sách
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const authToken = request.cookies.get('authToken')?.value;
    if (!authToken) {
      return NextResponse.json(
        { status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!' },
        { status: 401 }
      );
    }

    const { id } = await Promise.resolve(context.params);
    const body = await request.json();
    
    // Log request để debug
    console.log(`Updating book ${id} with data:`, body);

    const res = await fetch(`http://localhost:8081/api/books/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ status: false, userMessage: 'Có lỗi kết nối server backend' }, { status: 500 });
  }
}

// Xóa sách
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const authToken = request.cookies.get('authToken')?.value;
    if (!authToken) {
      return NextResponse.json(
        { status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!' },
        { status: 401 }
      );
    }

    const { id } = await Promise.resolve(context.params);
    const res = await fetch(`http://localhost:8081/api/books/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + authToken
      }
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ status: false, userMessage: 'Có lỗi kết nối server backend' }, { status: 500 });
  }
}
