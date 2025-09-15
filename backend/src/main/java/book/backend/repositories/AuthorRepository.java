package book.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import book.backend.models.entities.Author;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {
        Optional<Author> findByAuthorname(String authorName);
}
