package book.backend.models.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserGetsResponse {
    private Long id;
    private String username;
    private String role;
    private String fullName;
    private String createdAt;
}
