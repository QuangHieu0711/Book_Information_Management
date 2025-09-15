package book.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import book.backend.models.entities.BorrowDetail;

public interface BorrowDetailRepository extends JpaRepository<BorrowDetail, Long> {
    List<BorrowDetail> findByBorrowId(Long borrowId);
}
