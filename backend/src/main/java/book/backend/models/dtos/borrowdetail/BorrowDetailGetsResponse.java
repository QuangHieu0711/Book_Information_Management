package book.backend.models.dtos.borrowdetail;

import book.backend.models.entities.Book;
import book.backend.models.entities.Borrow;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BorrowDetailGetsResponse {
    private Long id;
    private Borrow borrow;
    private Book book;
    private Integer quantity;
    

}
