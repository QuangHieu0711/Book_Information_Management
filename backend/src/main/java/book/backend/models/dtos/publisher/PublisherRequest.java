package book.backend.models.dtos.publisher;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PublisherRequest {
    @NotBlank(message = "Vui lòng nhập tên nhà xuất bản")
    private String publisherName;

    @NotBlank(message = "Vui lòng nhập địa chỉ nhà xuất bản")
    private String address;

    @NotBlank(message = "Vui lòng nhập số điện thoại nhà xuất bản")
    private String phone;

    @NotBlank(message = "Vui lòng nhập email nhà xuất bản")
    private String email;

    @NotBlank(message = "Vui lòng nhập website nhà xuất bản")
    private String website;

    @NotNull
    private Boolean isActive;

}
