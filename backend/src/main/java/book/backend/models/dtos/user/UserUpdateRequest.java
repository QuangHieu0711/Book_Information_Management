package book.backend.models.dtos.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserUpdateRequest {
    @NotBlank(message = "Vui lòng nhập tên đăng nhập")
    private String username;
    @NotBlank(message = "Vui lòng nhập vai trò")
    private String role;
    @NotBlank(message = "Vui lòng nhập họ và tên")
    private String fullName;
}