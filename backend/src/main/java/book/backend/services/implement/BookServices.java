package book.backend.services.implement;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import book.backend.models.dtos.book.BookGetsResponse;
import book.backend.models.dtos.book.BookRequest;
import book.backend.models.dtos.book.BookUpdateRequest;
import book.backend.models.entities.Author;
import book.backend.models.entities.Book;
import book.backend.models.entities.Category;
import book.backend.models.entities.Publisher;
import book.backend.models.entities.User;
import book.backend.models.global.ApiResult;
import book.backend.repositories.AuthorRepository;
import book.backend.repositories.BookRepository;
import book.backend.repositories.CategoryRepository;
import book.backend.repositories.PublisherRepository;
import book.backend.repositories.UserRepository;
import book.backend.services.interfaces.IBookServices;

@Service
public class BookServices implements IBookServices {
    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final PublisherRepository publisherRepository;
    private final UserRepository userRepository;

    public BookServices(
        BookRepository bookRepository,
        CategoryRepository categoryRepository,
        AuthorRepository authorRepository,
        PublisherRepository publisherRepository,
        UserRepository userRepository
    ) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ApiResult<List<BookGetsResponse>> getsBook() {
        List<Book> books = bookRepository.findAll();
        List<BookGetsResponse> responseList = books.stream()
            .map(book -> new BookGetsResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor() != null ? book.getAuthor().getAuthorname() : null,
                book.getAuthor() != null ? book.getAuthor().getId() : null,
                book.getCategory() != null ? book.getCategory().getCategoryname() : null,
                book.getCategory() != null ? book.getCategory().getId() : null,
                book.getPublisher() != null ? book.getPublisher().getPublisherName() : null,
                book.getPublisher() != null ? book.getPublisher().getId() : null,
                book.getYearPublished(),
                book.getPrice(),
                book.getQuantity(),
                book.getQuantityAvailable(),
                book.getDescription(),
                book.getLanguage(),
                book.getUser() != null ? book.getUser().getFullName() : null,
                book.getCreatedAt()
            ))
            .sorted(Comparator.comparing(BookGetsResponse::getCreatedAt).reversed())
            .toList();
        return ApiResult.success(responseList, "Lấy danh sách sách thành công");
    }

    @Override
    public ApiResult<Long> createBook(BookRequest request) {
        Book book = new Book();
        book.setTitle(request.getTitle());
        book.setYearPublished(request.getYearPublished());
        book.setPrice(request.getPrice());
        book.setQuantity(request.getQuantity());
        book.setDescription(request.getDescription());
        book.setLanguage(request.getLanguage());

        // Đúng repository cho từng entity
        Author author = authorRepository.findByAuthorname(request.getAuthorName())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy tác giả"));
        book.setAuthor(author);

        Category category = categoryRepository.findByCategoryname(request.getCategory())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy thể loại"));
        book.setCategory(category);

        Publisher publisher = publisherRepository.findByPublisherName(request.getPublisher())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy nhà xuất bản"));
        book.setPublisher(publisher);

        User user = userRepository.findByFullName(request.getUser())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        book.setUser(user);

        bookRepository.save(book);
        return ApiResult.success(book.getId(), "Tạo sách thành công");
    }

    @Override
    public ApiResult<String> updateBook(Long id, BookUpdateRequest request) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sách"));
        book.setTitle(request.getTitle());
        book.setYearPublished(request.getYearPublished());
        book.setPrice(request.getPrice());
        book.setQuantity(request.getQuantity());
        book.setDescription(request.getDescription());
        book.setLanguage(request.getLanguage());

        Author author = authorRepository.findByAuthorname(request.getAuthorName())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy tác giả"));
        book.setAuthor(author);

        Category category = categoryRepository.findByCategoryname(request.getCategory())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy thể loại"));
        book.setCategory(category);

        Publisher publisher = publisherRepository.findByPublisherName(request.getPublisher())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy nhà xuất bản"));
        book.setPublisher(publisher);
        bookRepository.save(book);
        return ApiResult.success(null, "Cập nhật sách thành công");
    }

    @Override
    public ApiResult<String> deleteBook(Long id) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sách"));
        bookRepository.delete(book);
        return ApiResult.success(null, "Xóa sách thành công");
    }

    @Override
    public ApiResult<BookGetsResponse> getBookDetail(Long id) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sách"));
        BookGetsResponse response = new BookGetsResponse(
            book.getId(),
            book.getTitle(),
            book.getAuthor() != null ? book.getAuthor().getAuthorname() : null,
            book.getAuthor() != null ? book.getAuthor().getId() : null,
            book.getCategory() != null ? book.getCategory().getCategoryname() : null,
            book.getCategory() != null ? book.getCategory().getId() : null,
            book.getPublisher() != null ? book.getPublisher().getPublisherName() : null,
            book.getPublisher() != null ? book.getPublisher().getId() : null,
            book.getYearPublished(),
            book.getPrice(),
            book.getQuantity(),
            book.getQuantityAvailable(),
            book.getDescription(),
            book.getLanguage(),
            book.getUser() != null ? book.getUser().getFullName() : null,
            book.getCreatedAt()
        );
        return ApiResult.success(response, "Lấy chi tiết sách thành công");
    }
}