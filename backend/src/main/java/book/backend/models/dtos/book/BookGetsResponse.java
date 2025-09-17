package book.backend.models.dtos.book;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookGetsResponse {
    private Long id;
    private String title;
    private String author;
    private Long authorId;       
    private String category;
    private Long categoryId;    
    private String publisher;
    private Long publisherId;   
    private Integer yearPublished;
    private BigDecimal price;
    private Integer quantity;
    private Integer quantityAvailable;
    private String description;
    private String language;
    private String user;
    private LocalDateTime createdAt;
}