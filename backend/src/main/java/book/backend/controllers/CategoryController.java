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

import book.backend.models.dtos.category.CategoryGetsResponse;
import book.backend.models.dtos.category.CategoryRequest;
import book.backend.models.dtos.category.CategoryUpdateRequest;
import book.backend.models.global.ApiResult;
import book.backend.services.interfaces.ICategoryServices;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
public class CategoryController extends ApiBaseController {
    private final ICategoryServices categoryServices;

    public CategoryController(ICategoryServices categoryServices) {
        this.categoryServices = categoryServices;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResult<List<CategoryGetsResponse>>> getsCategory() {
        return executeApiResult(() -> categoryServices.getsCategory());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<CategoryGetsResponse>> getCategoryDetail(@PathVariable Long id) {
        return executeApiResult(() -> categoryServices.getCategoryDetail(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResult<Long>> createCategory(@Valid @RequestBody CategoryRequest apiRequest) {
        return executeApiResult(() -> categoryServices.createCategory(apiRequest));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResult<String>> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryUpdateRequest apiRequest) {
        return executeApiResult(() -> categoryServices.updateCategory(id, apiRequest));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResult<String>> deleteCategory(@PathVariable Long id) {
        return executeApiResult(() -> categoryServices.deleteCategory(id));
    }
}