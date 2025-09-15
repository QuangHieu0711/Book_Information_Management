package book.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import book.backend.models.entities.Borrow;

@Repository
public interface BorrowRepository extends JpaRepository<Borrow, Long> {

}
