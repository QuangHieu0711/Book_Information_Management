package book.backend.services.interfaces;

import java.util.List;

import book.backend.models.dtos.book.BookGetsResponse;
import book.backend.models.dtos.book.BookRequest;
import book.backend.models.dtos.book.BookUpdateRequest;
import book.backend.models.global.ApiResult;

public interface IBookServices {
    ApiResult<BookGetsResponse> getBookDetail(Long id);
    ApiResult<List<BookGetsResponse>> getsBook();
    ApiResult<Long> createBook(BookRequest request);
    ApiResult<String> updateBook(Long id, BookUpdateRequest request);
    ApiResult<String> deleteBook(Long id);
}
