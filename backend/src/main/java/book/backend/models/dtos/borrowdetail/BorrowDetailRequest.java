package book.backend.models.dtos.borrowdetail;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BorrowDetailRequest {
    @NotNull(message = "Vui lòng nhập ID phiếu mượn")
    private Long borrowId;

    @NotNull(message = "Vui lòng nhập sách")
    private Long bookId;

    @NotNull(message = "Vui lòng nhập số lượng")
    private Integer quantity;
}