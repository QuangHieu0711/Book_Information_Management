package book.backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("hasRole('ADMIN') or hasRole('admin')")
    @PostMapping("/batch")
    public ResponseEntity<ApiResult<List<Long>>> createBorrowDetails(@Valid @RequestBody List<BorrowDetailRequest> requests) {
        return executeApiResult(() -> borrowDetailServices.createBorrowDetails(requests));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('user')")
    @GetMapping()
    public ResponseEntity<ApiResult<List<BorrowDetailGetsResponse>>> getBorrowDetails(@RequestParam Long borrowId) {
        return executeApiResult(() -> {
            ApiResult<List<BorrowDetailGetsResponse>> apiResult = borrowDetailServices.getsBorrowDetail(borrowId);
            return apiResult; 
        });
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('admin')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResult<String>> updateBorrowDetail(
            @PathVariable Long id,
            @Valid @RequestBody BorrowDetailRequest request,
            @RequestParam String status) { // Thêm status để xác định mượn/trả
        return executeApiResult(() -> borrowDetailServices.updateBorrowDetail(id, request, status));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResult<String>> deleteBorrowDetail(@PathVariable Long id) {
        return executeApiResult(() -> borrowDetailServices.deleteBorrowDetail(id));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('admin')")
    @DeleteMapping("/batch/delete")
    public ResponseEntity<ApiResult<String>> deleteBorrowDetails(@RequestBody List<Long> ids) {
        return executeApiResult(() -> borrowDetailServices.deleteBorrowDetails(ids));
    }
}