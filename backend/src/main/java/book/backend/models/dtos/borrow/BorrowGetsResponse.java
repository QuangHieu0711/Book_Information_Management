package book.backend.models.dtos.borrow;

import java.time.LocalDate;
import java.util.List;

import book.backend.models.dtos.borrowdetail.BorrowDetailGetsResponse;
import book.backend.models.entities.User;
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
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private User user;
    private List<BorrowDetailGetsResponse> details;
}
