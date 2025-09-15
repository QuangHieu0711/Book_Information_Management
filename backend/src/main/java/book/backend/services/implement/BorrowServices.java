package book.backend.services.implement;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import book.backend.controllers.exceptions.UserMessageException;
import book.backend.models.dtos.borrow.BorrowGetsResponse;
import book.backend.models.dtos.borrow.BorrowRequest;
import book.backend.models.dtos.borrowdetail.BorrowDetailRequest;
import book.backend.models.entities.Borrow;
import book.backend.models.entities.BorrowDetail;
import book.backend.models.entities.User;
import book.backend.models.global.ApiResult;
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

    public BorrowServices(
            BorrowRepository borrowRepository,
            BorrowDetailRepository borrowDetailRepository,
            IBorrowDetailServices borrowDetailServices,
            UserRepository userRepository) {
        this.borrowRepository = borrowRepository;
        this.borrowDetailRepository = borrowDetailRepository;
        this.borrowDetailServices = borrowDetailServices;
        this.userRepository = userRepository;
    }

    @Override
    public ApiResult<List<BorrowGetsResponse>> getsBorrow() {
        List<Borrow> borrows = borrowRepository.findAll();
        List<BorrowGetsResponse> response = borrows.stream()
        .map(borrow -> BorrowGetsResponse.builder()
                .id(borrow.getId())
                .borrowDate(borrow.getBorrowDate())
                .returnDate(borrow.getReturnDate())
                .actualReturnDate(borrow.getActualReturnDate())
                .status(borrow.getStatus())
                .createdAt(borrow.getCreatedAt())
                .updatedAt(borrow.getUpdatedAt())
                .user(borrow.getUser())
                .build())
        .collect(Collectors.toList());
        return ApiResult.success(response, "Lấy danh sách phiếu mượn thành công");
    }


    // @Override
    // public ApiResult<BorrowGetsResponse> getBorrowWithDetails(Long id) {
    //     Borrow borrow = borrowRepository.findById(id)
    //             .orElseThrow(() -> new UserMessageException("Phiếu mượn không tồn tại!"));

    //     List<BorrowDetailGetsResponse> detailResponses = borrowDetailServices.getsBorrowDetail(borrow.getId()).getData();
    //     BorrowGetsResponse response = BorrowGetsResponse.builder()
    //     .id(borrow.getId())
    //     .borrowDate(borrow.getBorrowDate())
    //     .returnDate(borrow.getReturnDate())
    //     .actualReturnDate(borrow.getActualReturnDate())
    //     .status(borrow.getStatus())
    //     .createdAt(borrow.getCreatedAt())
    //     .updatedAt(borrow.getUpdatedAt())
    //     .user(borrow.getUser())
    //     .details(detailResponses)
    //     .build();
    //     return ApiResult.success(response, "Lấy chi tiết phiếu mượn thành công");
    // }

    @Override
    @Transactional
    public ApiResult<Long> createBorrow(Long userId, BorrowRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserMessageException("Người dùng không tồn tại!"));
        Borrow borrow = new Borrow();
        borrow.setUser(user);
        borrow.setBorrowDate(request.getBorrowDate());
        borrow.setReturnDate(request.getReturnDate());
        borrow.setStatus(request.getStatus());
        borrowRepository.save(borrow);
        if (request.getBorrowDetails() != null) {
            for (BorrowDetailRequest detailReq : request.getBorrowDetails()) {
                detailReq.setBorrowId(borrow.getId());
                borrowDetailServices.createBorrowDetail(detailReq);
            }
        }
        return ApiResult.success(borrow.getId(), "Tạo phiếu mượn thành công");
    }

    @Override
    @Transactional
    public ApiResult<String> updateBorrow(Long id, BorrowRequest request) {
        Borrow borrow = borrowRepository.findById(id)
                .orElseThrow(() -> new UserMessageException("Phiếu mượn không tồn tại!"));
        borrow.setBorrowDate(request.getBorrowDate());
        borrow.setReturnDate(request.getReturnDate());
        borrow.setStatus(request.getStatus());
        borrowRepository.save(borrow);
        if (request.getBorrowDetails() != null) {
            List<BorrowDetail> existingDetails = borrowDetailRepository.findByBorrowId(id);
            for (BorrowDetail detail : existingDetails) {
                borrowDetailServices.deleteBorrowDetail(detail.getId());
            }
            for (BorrowDetailRequest detailReq : request.getBorrowDetails()) {
                detailReq.setBorrowId(borrow.getId());
                borrowDetailServices.createBorrowDetail(detailReq);
            }
        }
        return ApiResult.success(null, "Cập nhật phiếu mượn thành công");
    }

        @Override
        public ApiResult<String> deleteBorrow(Long id) {
        Borrow borrow = borrowRepository.findById(id)
                .orElseThrow(() -> new UserMessageException("Phiếu mượn không tồn tại!"));
        List<BorrowDetail> details = borrowDetailRepository.findByBorrowId(id);
        for (BorrowDetail detail : details) {
            borrowDetailServices.deleteBorrowDetail(detail.getId());
        }
        borrowRepository.delete(borrow);
        return ApiResult.success(null, "Xóa phiếu mượn thành công");
    }
}