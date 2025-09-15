package book.backend.models.dtos.category;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor  
@AllArgsConstructor
public class CategoryGetsResponse {
    private Long id;
    private String categoryname;
    private LocalDateTime createdAt;

}
