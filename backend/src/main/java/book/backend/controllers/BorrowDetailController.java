package book.backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import book.backend.models.dtos.borrowdetail.BorrowDetailRequest;
import book.backend.models.dtos.borrowdetail.BorrowDetailGetsResponse;
import book.backend.models.global.ApiResult;
import book.backend.services.interfaces.IBorrowDetailServices;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/borrow-details")
public class BorrowDetailController extends ApiBaseController {
    private final IBorrowDetailServices borrowDetailServices;

    public BorrowDetailController(IBorrowDetailServices borrowDetailServices) {
        this.borrowDetailServices = borrowDetailServices;
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResult<List<Long>>> createBorrowDetails(@Valid @RequestBody List<BorrowDetailRequest> requests) {
        return executeApiResult(() -> borrowDetailServices.createBorrowDetails(requests));
    }

    @GetMapping()
    public ResponseEntity<ApiResult<List<BorrowDetailGetsResponse>>> getBorrowDetails(@RequestParam Long borrowId) {
        return executeApiResult(() -> {
            ApiResult<List<BorrowDetailGetsResponse>> apiResult = borrowDetailServices.getsBorrowDetail(borrowId);
            return apiResult; // Trả về trực tiếp ApiResult từ service, tránh tạo mới không cần thiết
        });
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResult<String>> updateBorrowDetail(
            @PathVariable Long id,
            @Valid @RequestBody BorrowDetailRequest request,
            @RequestParam String status) { // Thêm status để xác định mượn/trả
        return executeApiResult(() -> borrowDetailServices.updateBorrowDetail(id, request, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResult<String>> deleteBorrowDetail(@PathVariable Long id) {
        return executeApiResult(() -> borrowDetailServices.deleteBorrowDetail(id));
    }

    @DeleteMapping("/batch/delete")
    public ResponseEntity<ApiResult<String>> deleteBorrowDetails(@RequestBody List<Long> ids) {
        return executeApiResult(() -> borrowDetailServices.deleteBorrowDetails(ids));
    }
}