package book.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import book.backend.models.entities.Borrow;

@Repository
public interface BorrowRepository extends JpaRepository<Borrow, Long> {
    @Query("SELECT b FROM Borrow b LEFT JOIN FETCH b.user LEFT JOIN FETCH b.borrowDetails")
    List<Borrow> findAllWithFetch();

}
