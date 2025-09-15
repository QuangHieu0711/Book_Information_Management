package book.backend.services.interfaces;

import java.util.List;

import book.backend.models.dtos.borrow.BorrowGetsResponse;
import book.backend.models.dtos.borrow.BorrowRequest;
import book.backend.models.global.ApiResult;

public interface IBorrowServices {
    ApiResult<List<BorrowGetsResponse>> getsBorrow();
    //ApiResult<BorrowGetsResponse> getBorrowWithDetails(Long id);
    ApiResult<Long> createBorrow(Long userId,BorrowRequest request);
    ApiResult<String> updateBorrow(Long id, BorrowRequest request);
    ApiResult<String> deleteBorrow(Long id);
}
