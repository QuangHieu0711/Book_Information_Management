package book.backend.services.implement;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import book.backend.controllers.exceptions.UserMessageException;
import book.backend.models.dtos.borrowdetail.BorrowDetailGetsResponse;
import book.backend.models.dtos.borrowdetail.BorrowDetailRequest;
import book.backend.models.entities.Book;
import book.backend.models.entities.Borrow;
import book.backend.models.entities.BorrowDetail;
import book.backend.models.global.ApiResult;
import book.backend.repositories.BookRepository;
import book.backend.repositories.BorrowDetailRepository;
import book.backend.repositories.BorrowRepository;
import book.backend.services.interfaces.IBorrowDetailServices;

@Service
public class BorrowDetailService implements IBorrowDetailServices {
    private final BorrowDetailRepository borrowDetailRepository;
    private final BorrowRepository borrowRepository;
    private final BookRepository bookRepository;

    public BorrowDetailService(BorrowDetailRepository borrowDetailRepository, BorrowRepository borrowRepository, BookRepository bookRepository) {
        this.borrowDetailRepository = borrowDetailRepository;
        this.borrowRepository = borrowRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public ApiResult<List<Book>> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        return ApiResult.success(books, "Lấy danh sách sách thành công");
    }

    @Override
    public ApiResult<List<BorrowDetailGetsResponse>> getsBorrowDetail(Long borrowId) {
        List<BorrowDetail> details = borrowDetailRepository.findByBorrowId(borrowId);
        List<BorrowDetailGetsResponse> response = details.stream()
            .map(detail -> BorrowDetailGetsResponse.builder()
                .id(detail.getId())
                .borrow(detail.getBorrow())
                .book(detail.getBook())
                .build())
            .collect(Collectors.toList());
        return ApiResult.success(response, "Lấy chi tiết phiếu mượn thành công");
    }

    @Override
    public ApiResult<Long> createBorrowDetail(BorrowDetailRequest request) {
        Borrow borrow = borrowRepository.findById(request.getBorrowId())
                .orElseThrow(() -> new UserMessageException("Phiếu mượn không tồn tại!"));
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new UserMessageException("Sách không tồn tại!"));
        BorrowDetail detail = new BorrowDetail();
        detail.setBorrow(borrow);
        detail.setBook(book);
        borrowDetailRepository.save(detail);
        return ApiResult.success(detail.getId(), "Tạo chi tiết phiếu mượn thành công");
    }

    @Override
    @Transactional
    public ApiResult<String> updateBorrowDetail(Long id, BorrowDetailRequest request) {
        BorrowDetail detail = borrowDetailRepository.findById(id)
                .orElseThrow(() -> new UserMessageException("Chi tiết phiếu mượn không tồn tại!"));
        if (request.getBookId() != null) {
            Book book = bookRepository.findById(request.getBookId())
                    .orElseThrow(() -> new UserMessageException("Sách không tồn tại!"));
            detail.setBook(book);
        }
        borrowDetailRepository.save(detail);
        return ApiResult.success(null, "Cập nhật chi tiết phiếu mượn thành công");
    }

    @Override
    @Transactional
    public ApiResult<String> deleteBorrowDetail(Long id) {
        BorrowDetail detail = borrowDetailRepository.findById(id)
                .orElseThrow(() -> new UserMessageException("Chi tiết phiếu mượn không tồn tại!"));
        borrowDetailRepository.delete(detail);
        return ApiResult.success(null, "Xóa chi tiết phiếu mượn thành công");
    }
}