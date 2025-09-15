package book.backend.controllers;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody; 
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import book.backend.models.dtos.author.AuthorRequest;
import book.backend.models.dtos.author.AuthorResponse;
import book.backend.models.dtos.author.AuthorUpdateRequest;

import book.backend.models.global.ApiResult;
import book.backend.services.interfaces.IAuthorServices;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/authors")
public class AuthorController extends ApiBaseController {
    private final IAuthorServices authorServices;

    public AuthorController(IAuthorServices authorServices) {
        this.authorServices = authorServices;
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResult<List<AuthorResponse>>> getsAuthor() {
        return executeApiResult(() -> authorServices.getsAuthor());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<AuthorResponse>> getAuthorDetail(@PathVariable Long id) {
        return executeApiResult(() -> authorServices.getAuthorDetail(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResult<Long>> createAuthor(@Valid @RequestBody AuthorRequest apiRequest) {
        return executeApiResult(() -> authorServices.createAuthor(apiRequest));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResult<String>> updateAuthor(@PathVariable Long id, @Valid @RequestBody AuthorUpdateRequest apiRequest) {
        return executeApiResult(() -> authorServices.updateAuthor(id, apiRequest));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResult<String>> deleteAuthor(@PathVariable Long id) {
        return executeApiResult(() -> authorServices.deleteAuthor(id));
    }
}