package book.backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import book.backend.models.dtos.book.BookGetsResponse;
import book.backend.models.dtos.book.BookRequest;
import book.backend.models.dtos.book.BookUpdateRequest;
import book.backend.models.global.ApiResult;
import book.backend.services.interfaces.IBookServices;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/books")
public class BookController extends ApiBaseController {
    private final IBookServices bookServices;

    public BookController(IBookServices bookServices) {
        this.bookServices = bookServices;
    }
     
    @GetMapping
    public ResponseEntity<ApiResult<List<BookGetsResponse>>> getsBook() {
        return executeApiResult(() -> bookServices.getsBook());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<BookGetsResponse>> getBookDetail(@PathVariable Long id) {
        return executeApiResult(() -> bookServices.getBookDetail(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResult<Long>> createBook(@Valid @RequestBody BookRequest apiRequest) {
        return executeApiResult(() -> bookServices.createBook(apiRequest));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResult<String>> updateBook(@PathVariable Long id, @Valid @RequestBody BookUpdateRequest apiRequest) {
        return executeApiResult(() -> bookServices.updateBook(id, apiRequest));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResult<String>> deleteBook(@PathVariable Long id) {
        return executeApiResult(() -> bookServices.deleteBook(id));
    }
}