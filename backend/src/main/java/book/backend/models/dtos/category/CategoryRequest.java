package book.backend.models.dtos.category;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryRequest {
    @NotBlank(message = "Vui lòng nhập tên thể loại")
    private String categoryname;
}
