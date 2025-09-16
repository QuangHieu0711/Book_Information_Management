package book.backend.services.implement;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import book.backend.controllers.exceptions.UserMessageException;
import book.backend.models.dtos.borrow.BorrowGetsResponse;
import book.backend.models.dtos.borrow.BorrowRequest;
import book.backend.models.dtos.borrowdetail.BorrowDetailGetsResponse;
import book.backend.models.entities.Borrow;
import book.backend.models.entities.User;
import book.backend.models.global.ApiResult;
import book.backend.repositories.BookRepository;
import book.backend.repositories.BorrowDetailRepository;
import book.backend.repositories.BorrowRepository;
import book.backend.repositories.UserRepository;
import book.backend.services.interfaces.IBorrowDetailServices;
import book.backend.services.interfaces.IBorrowServices;

@Service
public class BorrowServices implements IBorrowServices {

    private final BorrowRepository borrowRepository;
    private final BorrowDetailRepository borrowDetailRepository;
    private final IBorrowDetailServices borrowDetailServices;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public BorrowServices(BorrowRepository borrowRepository, BorrowDetailRepository borrowDetailRepository,
            IBorrowDetailServices borrowDetailServices, UserRepository userRepository, BookRepository bookRepository) {
        this.borrowRepository = borrowRepository;
        this.borrowDetailRepository = borrowDetailRepository;
        this.borrowDetailServices = borrowDetailServices;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResult<List<BorrowGetsResponse>> getsBorrow() {
        List<Borrow> borrows = borrowRepository.findAllWithFetch();
        List<BorrowGetsResponse> response = borrows.stream()
                .map((Borrow borrow) -> {
                    try {
                        // Lấy danh sách BorrowDetailGetsResponse
                        List<BorrowDetailGetsResponse> detailResponses = borrowDetailServices.getsBorrowDetail(borrow.getId()).getData();
                        // Lấy userId an toàn
                        Long userId = (borrow.getUser() != null && borrow.getUser().getId() != null) ? borrow.getUser().getId() : null;
                        return BorrowGetsResponse.builder()
                                .id(borrow.getId())
                                .borrowDate(borrow.getBorrowDate())
                                .returnDate(borrow.getReturnDate())
                                .actualReturnDate(borrow.getActualReturnDate())
                                .status(borrow.getStatus())
                                .createdAt(borrow.getCreatedAt())
                                .updatedAt(borrow.getUpdatedAt())
                                .userId(userId)
                                .details(detailResponses)
                                .build();
                    } catch (Exception e) {
                        System.err.println("Error processing borrow ID " + (borrow.getId() != null ? borrow.getId() : "null") + ": " + e.getMessage());
                        Long userId = (borrow.getUser() != null && borrow.getUser().getId() != null) ? borrow.getUser().getId() : null;
                        return BorrowGetsResponse.builder()
                                .id(borrow.getId())
                                .borrowDate(borrow.getBorrowDate())
                                .returnDate(borrow.getReturnDate())
                                .actualReturnDate(borrow.getActualReturnDate())
                                .status(borrow.getStatus())
                                .createdAt(borrow.getCreatedAt())
                                .updatedAt(borrow.getUpdatedAt())
                                .userId(userId)
                                .details(new ArrayList<>())
                                .build();
                    }
                })
                .collect(Collectors.toList());
        return ApiResult.success(response, "Lấy danh sách phiếu mượn thành công");
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResult<BorrowGetsResponse> getBorrowDetail(Long id) {
        if (id == null) {
            throw new UserMessageException("ID phiếu mượn không được để trống!");
        }

        Borrow borrow = borrowRepository.findById(id)
                .orElseThrow(() -> new UserMessageException("Phiếu mượn không tồn tại!"));

        List<BorrowDetailGetsResponse> detailResponses;
        try {
            detailResponses = borrowDetailServices.getsBorrowDetail(borrow.getId()).getData();
        } catch (Exception e) {
            System.err.println("Error getting borrow details for ID " + id + ": " + e.getMessage());
            detailResponses = new ArrayList<>();
        }

        Long userId = (borrow.getUser() != null && borrow.getUser().getId() != null) ? borrow.getUser().getId() : null;

        BorrowGetsResponse response = BorrowGetsResponse.builder()
                .id(borrow.getId())
                .borrowDate(borrow.getBorrowDate())
                .returnDate(borrow.getReturnDate())
                .actualReturnDate(borrow.getActualReturnDate())
                .status(borrow.getStatus())
                .createdAt(borrow.getCreatedAt())
                .updatedAt(borrow.getUpdatedAt())
                .userId(userId)
                .details(detailResponses != null ? detailResponses : new ArrayList<>())
                .build();

        return ApiResult.success(response, "Lấy chi tiết phiếu mượn thành công");
    }

    @Override
    @Transactional
    public ApiResult<Long> createBorrow(Long userId, BorrowRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserMessageException("Người dùng không tồn tại!"));

        if (request.getReturnDate() != null && request.getBorrowDate() != null
                && request.getReturnDate().isBefore(request.getBorrowDate())) {
            throw new UserMessageException("Ngày trả phải sau ngày mượn!");
        }

        Borrow borrow = new Borrow();
        borrow.setUser(user);
        borrow.setBorrowDate(request.getBorrowDate() != null ? request.getBorrowDate() : LocalDate.now());
        borrow.setReturnDate(request.getReturnDate());
        borrow.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING");
        borrow.setActualReturnDate(request.getActualReturnDate());
        borrow.setBorrowDetails(new ArrayList<>());

        borrowRepository.save(borrow);
        return ApiResult.success(borrow.getId(), "Tạo phiếu mượn thành công");
    }

    @Override
    @Transactional
    public ApiResult<String> updateBorrow(Long id, BorrowRequest request) {
        Borrow borrow = borrowRepository.findById(id)
                .orElseThrow(() -> new UserMessageException("Phiếu mượn không tồn tại!"));

        if (request.getBorrowDate() != null) {
            borrow.setBorrowDate(request.getBorrowDate());
        }
        if (request.getReturnDate() != null) {
            borrow.setReturnDate(request.getReturnDate());
        }
        if (request.getStatus() != null) {
            borrow.setStatus(request.getStatus());
        }
        if (request.getActualReturnDate() != null) {
            borrow.setActualReturnDate(request.getActualReturnDate());
        }

        if (borrow.getReturnDate() != null && borrow.getBorrowDate() != null
                && borrow.getReturnDate().isBefore(borrow.getBorrowDate())) {
            throw new UserMessageException("Ngày trả phải sau ngày mượn!");
        }

        borrowRepository.save(borrow);
        return ApiResult.success(null, "Cập nhật phiếu mượn thành công");
    }

    @Override
    @Transactional
    public ApiResult<String> deleteBorrow(Long id) {
        Borrow borrow = borrowRepository.findById(id)
                .orElseThrow(() -> new UserMessageException("Phiếu mượn không tồn tại!"));
        borrowRepository.delete(borrow);
        return ApiResult.success(null, "Xóa phiếu mượn thành công");
    }
}