package book.backend.models.dtos.book;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookRequest {
    @NotBlank(message = "Vui lòng nhập tiêu đề sách")
    private String title;

    @NotBlank(message = "Vui lòng nhập tên tác giả")
    private String authorName;

    @NotBlank(message = "Vui lòng nhập thể loại")
    private String category;

    @NotBlank(message = "Vui lòng nhập nhà xuất bản")
    private String publisher;

    @NotNull(message = "Vui lòng nhập năm xuất bản")
    private Integer yearPublished;

    @NotNull(message = "Vui lòng nhập giá sách")
    private BigDecimal price;

    @NotNull(message = "Vui lòng nhập số lượng")
    private Integer quantity;

    @NotBlank(message = "Vui lòng nhập mô tả sách")
    private String description;

    @NotBlank(message = "Vui lòng nhập ngôn ngữ")
    private String language;

    @NotBlank(message = "Vui lòng nhập người tạo")
    private String user;

    private LocalDateTime createdAt;
}