package book.backend.models.dtos.borrowdetail;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BorrowDetailGetsResponse {
    private Long id;
    private Long borrowId;
    private Long bookId;
    private Integer quantity;
}