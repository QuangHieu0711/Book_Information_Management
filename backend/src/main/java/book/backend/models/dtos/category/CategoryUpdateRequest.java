package book.backend.models.dtos.category;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryUpdateRequest {
    @NotBlank(message = "Vui lòng nhập tên thể loại")
    private String categoryname;
}
