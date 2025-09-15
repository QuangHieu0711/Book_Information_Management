package book.backend.models.dtos.borrowdetail;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BorrowDetailRequest {
    @NotBlank(message = "Vui lòng nhập phiếu mượn")
    private Long borrowId;
    @NotBlank(message = "Vui lòng nhập sách")
    private Long bookId;
}
