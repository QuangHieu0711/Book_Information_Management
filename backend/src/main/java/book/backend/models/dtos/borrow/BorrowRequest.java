package book.backend.models.dtos.borrow;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BorrowRequest {
    @NotNull(message = "Vui lòng nhập ngày mượn")
    private LocalDate borrowDate;

    @NotNull(message = "Vui lòng nhập ngày hẹn trả")
    private LocalDate returnDate;

    private LocalDate actualReturnDate;

    @NotBlank(message = "Vui lòng nhập trạng thái")
    private String status;

}