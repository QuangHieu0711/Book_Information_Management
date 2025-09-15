package book.backend.models.dtos.borrow;

import java.time.LocalDate;
import java.util.List;

import book.backend.models.dtos.borrowdetail.BorrowDetailRequest;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BorrowRequest {
    @NotBlank(message = "Vui lòng nhập ngày mượn")
    private LocalDate borrowDate;
    @NotBlank(message = "Vui lòng nhập ngày hẹn trả")
    private LocalDate returnDate;
    @NotBlank(message = "Vui lòng nhập ngày trả thực tế")
    private LocalDate actualReturnDate;
    @NotBlank(message = "Vui lòng nhập trạng thái")
    private String status;
    private List<BorrowDetailRequest> borrowDetails;
}
