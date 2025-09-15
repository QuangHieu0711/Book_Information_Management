package book.backend.services.interfaces;

import java.util.List;

import book.backend.models.dtos.borrowdetail.BorrowDetailGetsResponse;
import book.backend.models.dtos.borrowdetail.BorrowDetailRequest;
import book.backend.models.entities.Book;
import book.backend.models.global.ApiResult;

public interface IBorrowDetailServices {
    ApiResult<List<Book>> getAllBooks();
    ApiResult<List<BorrowDetailGetsResponse>> getsBorrowDetail(Long borrowId);
    ApiResult<Long> createBorrowDetail(BorrowDetailRequest request);
    ApiResult<String> updateBorrowDetail(Long id, BorrowDetailRequest request);
    ApiResult<String> deleteBorrowDetail(Long id);

}
