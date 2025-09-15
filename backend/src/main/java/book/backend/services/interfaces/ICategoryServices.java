package book.backend.services.interfaces;

import java.util.List;


import book.backend.models.dtos.category.CategoryGetsResponse;
import book.backend.models.dtos.category.CategoryRequest;
import book.backend.models.dtos.category.CategoryUpdateRequest;
import book.backend.models.global.ApiResult;

public interface ICategoryServices {
    ApiResult<CategoryGetsResponse> getCategoryDetail(Long id);
    ApiResult<List<CategoryGetsResponse>> getsCategory();
    ApiResult<Long> createCategory(CategoryRequest request);
    ApiResult<String> updateCategory(Long id, CategoryUpdateRequest request);
    ApiResult<String> deleteCategory(Long id);

}
