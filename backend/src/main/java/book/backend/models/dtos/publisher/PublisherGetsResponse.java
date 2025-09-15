package book.backend.models.dtos.publisher;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublisherGetsResponse {
    private Long id;
    private String publisherName;
    private String address;
    private String phone;
    private String email;
    private String website;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
