import { NextRequest, NextResponse } from 'next/server';
import { CONST_API } from '../../../../constants';

export async function DELETE(req: NextRequest) {
  try {
    const authToken = req.cookies.get('authToken')?.value;
    if (!authToken) {
      return NextResponse.json(
        { status: false, userMessage: 'Bạn chưa đăng nhập hoặc thiếu token!' },
        { status: 401 }
      );
    }

    // Get array of IDs from request body
    const ids = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { status: false, userMessage: 'Danh sách ID không hợp lệ!' },
        { status: 400 }
      );
    }

    // Call backend API to delete borrow details in batch
    const promises = ids.map(id => 
      fetch(`${CONST_API}/borrow-details/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        }
      })
    );

    const results = await Promise.all(promises);
    const allSuccessful = results.every(res => res.ok);

    if (allSuccessful) {
      return NextResponse.json({ 
        status: true, 
        userMessage: 'Xóa chi tiết phiếu mượn thành công' 
      });
    } else {
      return NextResponse.json({ 
        status: false, 
        userMessage: 'Có lỗi xảy ra khi xóa chi tiết phiếu mượn' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in batch delete:', error);
    return NextResponse.json({ 
      status: false, 
      userMessage: 'Lỗi server khi xóa chi tiết phiếu mượn' 
    }, { status: 500 });
  }
}
