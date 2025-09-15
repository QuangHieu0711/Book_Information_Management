package book.backend.controllers;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import book.backend.models.dtos.borrow.BorrowGetsResponse;
import book.backend.models.dtos.borrow.BorrowRequest;
import book.backend.models.global.ApiResult;
import book.backend.services.interfaces.IBorrowServices;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/borrows")
public class BorrowController extends ApiBaseController {
     private final IBorrowServices borrowServices;

    public BorrowController(IBorrowServices borrowServices) {
        this.borrowServices = borrowServices;
    }

    @GetMapping()
    public ApiResult<List<BorrowGetsResponse>> getsBorrow() {
        return borrowServices.getsBorrow();
    }

    @PostMapping
    public ResponseEntity<ApiResult<Long>> createBorrow(@RequestParam Long userId, @Valid @RequestBody BorrowRequest apiRequest) {
        return executeApiResult(() -> borrowServices.createBorrow(userId, apiRequest));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResult<String>> updateBorrow(@PathVariable Long id, @Valid @RequestBody BorrowRequest apiRequest) {
        return executeApiResult(() -> borrowServices.updateBorrow(id, apiRequest));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResult<String>> deleteBorrow(@PathVariable Long id) {
        return executeApiResult(() -> borrowServices.deleteBorrow(id));
    }

}
