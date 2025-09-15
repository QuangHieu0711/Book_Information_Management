package book.backend.models.dtos.author;


import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthorUpdateRequest {
    @NotBlank(message = "Vui lòng nhập tên tác giả")
    private String authorname;

    @NotBlank(message = "Vui lòng nhập quốc tịch")
    private String nationality;

    private Integer birthYear;
}
