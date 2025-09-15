package book.backend.models.entities;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Borrows")
public class Borrow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "borrow")
    private List<BorrowDetail> borrowDetails;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private User user;

    @Column(length = 50)
    private LocalDate borrowDate;

    @Column(length = 50)
    private LocalDate returnDate;

    @Column(length = 50)
    private LocalDate actualReturnDate;

    @Column(nullable = false ,length = 50)
    private String status;

    @Column(length = 255)
    private LocalDate createdAt;

    @Column(length = 255)
    private LocalDate updatedAt;

}
