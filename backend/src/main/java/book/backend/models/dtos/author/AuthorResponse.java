package book.backend.models.dtos.author;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthorResponse {
    private Long id;
    private String authorname;
    private Integer birthYear;
    private String nationality;
    private LocalDateTime createdAt;
}
