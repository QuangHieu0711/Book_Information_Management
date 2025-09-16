package book.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import book.backend.models.entities.BorrowDetail;

public interface BorrowDetailRepository extends JpaRepository<BorrowDetail, Long> {
    List<BorrowDetail> findByBorrowId(Long borrowId);
    @Query("SELECT bd FROM BorrowDetail bd JOIN FETCH bd.borrow JOIN FETCH bd.book WHERE bd.borrow.id = :borrowId")
    List<BorrowDetail> findByBorrowIdWithFetch(@Param("borrowId") Long borrowId);
}
