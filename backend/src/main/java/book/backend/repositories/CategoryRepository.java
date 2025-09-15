package book.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import book.backend.models.entities.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
        Optional<Category> findByCategoryname(String categoryname);
}
