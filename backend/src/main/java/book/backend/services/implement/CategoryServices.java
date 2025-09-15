package book.backend.services.implement;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import book.backend.controllers.exceptions.UserMessageException;
import book.backend.models.dtos.category.CategoryGetsResponse;
import book.backend.models.dtos.category.CategoryRequest;
import book.backend.models.dtos.category.CategoryUpdateRequest;
import book.backend.models.entities.Category;
import book.backend.models.global.ApiResult;
import book.backend.repositories.CategoryRepository;
import book.backend.services.interfaces.ICategoryServices;

@Service
public class CategoryServices implements ICategoryServices {
    private final CategoryRepository categoryRepository;

    public CategoryServices(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public ApiResult<List<CategoryGetsResponse>> getsCategory() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryGetsResponse> responseList = categories.stream()
                .map(category -> new CategoryGetsResponse(category.getId(), category.getCategoryname(), category.getCreatedAt()))
                .sorted(Comparator.comparing(CategoryGetsResponse::getCreatedAt).reversed())
                .toList();
        return ApiResult.success(responseList, "Lấy danh sách thể loại thành công");
    }

    @Override
    public ApiResult<Long> createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setCategoryname(request.getCategoryname());
        categoryRepository.save(category);
        return ApiResult.success(category.getId(), "Tạo thể loại thành công");
    }

    @Override
    public ApiResult<String> updateCategory(Long id, CategoryUpdateRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new UserMessageException("Thể loại không tồn tại"));
        category.setCategoryname(request.getCategoryname());
        categoryRepository.save(category);
        return ApiResult.success(null, "Cập nhật thể loại thành công");
    }

    @Override
    public ApiResult<String> deleteCategory(Long id) {
        categoryRepository.deleteById(id);
        return ApiResult.success(null,"Xóa thể loại thành công");
    }

    @Override
    public ApiResult<CategoryGetsResponse> getCategoryDetail(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new UserMessageException("Thể loại không tồn tại"));
        CategoryGetsResponse response = new CategoryGetsResponse(
                category.getId(), category.getCategoryname(), category.getCreatedAt()
        );
        return ApiResult.success(response, "Lấy chi tiết thể loại thành công");
    }
}