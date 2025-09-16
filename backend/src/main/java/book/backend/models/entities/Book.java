package book.backend.models.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.Nationalized;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Nationalized
    @Column(nullable = false, length = 1000)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "authorId")
    private Author author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoryId")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisherId")
    private Publisher publisher;

    @Column(nullable = false, length = 4)
    private Integer yearPublished;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Nationalized
    @Column(nullable = false)
    private Integer quantity; 
    @Nationalized
    @Column(name = "quantity_available", nullable = false)
    private Integer quantityAvailable;

    @Nationalized
    @Column(length = 10000)
    private String description;

    @Nationalized
    @Column(length = 50)
    private String language;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private User user;

    @Column(length = 255)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (quantityAvailable == null) {
            quantityAvailable = quantity;
        }
    }
}