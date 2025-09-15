package book.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import book.backend.models.entities.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

}
