package book.backend.models.dtos.borrow;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import book.backend.models.dtos.borrowdetail.BorrowDetailGetsResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowGetsResponse {
    private Long id;
    private LocalDate borrowDate;
    private LocalDate returnDate;
    private LocalDate actualReturnDate;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
    private String fullName;
    private List<BorrowDetailGetsResponse> details;
}
