package book.backend.services.implement;

import java.util.ArrayList;
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

    public BorrowDetailService(BorrowDetailRepository borrowDetailRepository, BorrowRepository borrowRepository,
            BookRepository bookRepository) {
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
    @Transactional(readOnly = true)
    public ApiResult<List<BorrowDetailGetsResponse>> getsBorrowDetail(Long borrowId) {
        List<BorrowDetail> details = borrowDetailRepository.findByBorrowIdWithFetch(borrowId);
        if (details == null || details.isEmpty()) {
            return ApiResult.success(new ArrayList<>(), "Không tìm thấy chi tiết phiếu mượn!");
        }
        List<BorrowDetailGetsResponse> response = details.stream()
                .map(detail -> BorrowDetailGetsResponse.builder()
                        .id(detail.getId())
                        .borrowId(detail.getBorrow() != null ? detail.getBorrow().getId() : null)
                        .bookId(detail.getBook() != null ? detail.getBook().getId() : null)
                        .quantity(detail.getQuantity())
                        .build())
                .collect(Collectors.toList());
        return ApiResult.success(response, "Lấy danh sách chi tiết phiếu mượn thành công");
    }

    @Override
    @Transactional
    public ApiResult<Long> createBorrowDetail(BorrowDetailRequest request) {
        Borrow borrow = borrowRepository.findById(request.getBorrowId())
                .orElseThrow(() -> new UserMessageException("Không tìm thấy phiếu mượn!"));
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new UserMessageException("Sách không tồn tại!"));
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new UserMessageException("Số lượng phải lớn hơn 0!");
        }
        if (book.getQuantityAvailable() < request.getQuantity()) {
            throw new UserMessageException("Số lượng sách không đủ để mượn!");
        }

        BorrowDetail borrowDetail = new BorrowDetail();
        borrowDetail.setBorrow(borrow);
        borrowDetail.setBook(book);
        borrowDetail.setQuantity(request.getQuantity());

        book.setQuantityAvailable(book.getQuantityAvailable() - request.getQuantity());
        bookRepository.save(book);
        borrowDetailRepository.save(borrowDetail);

        return ApiResult.success(borrowDetail.getId(), "Tạo chi tiết phiếu mượn thành công");
    }

    @Transactional
    public ApiResult<List<Long>> createBorrowDetails(List<BorrowDetailRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            throw new UserMessageException("Danh sách chi tiết phiếu mượn không được rỗng!");
        }

        List<Long> detailIds = requests.stream().map(request -> {
            Borrow borrow = borrowRepository.findById(request.getBorrowId())
                    .orElseThrow(() -> new UserMessageException("Không tìm thấy phiếu mượn!"));
            Book book = bookRepository.findById(request.getBookId())
                    .orElseThrow(() -> new UserMessageException("Sách không tồn tại!"));
            if (request.getQuantity() == null || request.getQuantity() <= 0) {
                throw new UserMessageException("Số lượng phải lớn hơn 0!");
            }
            if (book.getQuantityAvailable() < request.getQuantity()) {
                throw new UserMessageException("Số lượng sách không đủ để mượn!");
            }

            BorrowDetail borrowDetail = new BorrowDetail();
            borrowDetail.setBorrow(borrow);
            borrowDetail.setBook(book);
            borrowDetail.setQuantity(request.getQuantity());

            book.setQuantityAvailable(book.getQuantityAvailable() - request.getQuantity());
            bookRepository.save(book);
            borrowDetailRepository.save(borrowDetail);
            return borrowDetail.getId();
        }).collect(Collectors.toList());

        return ApiResult.success(detailIds, "Tạo danh sách chi tiết phiếu mượn thành công");
    }

    @Override
    @Transactional
    public ApiResult<String> updateBorrowDetail(Long id, BorrowDetailRequest request, String status) {
        BorrowDetail detail = borrowDetailRepository.findById(id)
                .orElseThrow(() -> new UserMessageException("Chi tiết phiếu mượn không tồn tại!"));
        Borrow borrow = detail.getBorrow();
        Book book = detail.getBook();
        int oldQuantity = detail.getQuantity();
        int newQuantity = request.getQuantity() != null ? request.getQuantity() : oldQuantity;

        if (newQuantity <= 0) {
            throw new UserMessageException("Số lượng phải lớn hơn 0!");
        }

        if (request.getBookId() != null) {
            Book newBook = bookRepository.findById(request.getBookId())
                    .orElseThrow(() -> new UserMessageException("Sách không tồn tại!"));
            if (newBook.getQuantityAvailable() < newQuantity) {
                throw new UserMessageException("Số lượng sách không đủ để mượn!");
            }
            book.setQuantityAvailable(book.getQuantityAvailable() + oldQuantity);
            bookRepository.save(book);
            detail.setBook(newBook);
            book = newBook;
        }

        if ("MUON".equalsIgnoreCase(status)) {
            int quantityDifference = newQuantity - oldQuantity;
            if (book.getQuantityAvailable() < quantityDifference) {
                throw new UserMessageException("Số lượng sách không đủ để mượn thêm!");
            }
            book.setQuantityAvailable(book.getQuantityAvailable() - quantityDifference);
            borrow.setStatus("MUON");
        } else if ("DA TRA".equalsIgnoreCase(status)) {
            int quantityDifference = newQuantity - oldQuantity;
            book.setQuantityAvailable(book.getQuantityAvailable() + quantityDifference);
            borrow.setStatus("DA TRA");
        }

        detail.setQuantity(newQuantity);

        borrowRepository.save(borrow);
        borrowDetailRepository.save(detail);
        bookRepository.save(book);
        return ApiResult.success(null, "Cập nhật chi tiết phiếu mượn thành công");
    }

    @Override
    @Transactional
    public ApiResult<String> deleteBorrowDetail(Long id) {
        BorrowDetail detail = borrowDetailRepository.findById(id)
                .orElseThrow(() -> new UserMessageException("Chi tiết phiếu mượn không tồn tại!"));
        Book book = detail.getBook();
        book.setQuantityAvailable(book.getQuantityAvailable() + detail.getQuantity());
        bookRepository.save(book);
        borrowDetailRepository.delete(detail);
        return ApiResult.success(null, "Xóa chi tiết phiếu mượn thành công");
    }

    @Transactional
    public ApiResult<String> deleteBorrowDetails(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new UserMessageException("Danh sách ID không được rỗng!");
        }

        List<BorrowDetail> details = borrowDetailRepository.findAllById(ids);
        if (details.size() != ids.size()) {
            throw new UserMessageException("Một số chi tiết phiếu mượn không tồn tại!");
        }

        for (BorrowDetail detail : details) {
            Book book = detail.getBook();
            book.setQuantityAvailable(book.getQuantityAvailable() + detail.getQuantity());
            bookRepository.save(book);
        }

        borrowDetailRepository.deleteAll(details);
        return ApiResult.success(null, "Xóa danh sách chi tiết phiếu mượn thành công");
    }
}