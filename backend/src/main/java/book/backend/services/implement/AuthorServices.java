package book.backend.services.implement;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import book.backend.controllers.exceptions.UserMessageException;
import book.backend.models.dtos.author.AuthorRequest;
import book.backend.models.dtos.author.AuthorResponse;
import book.backend.models.dtos.author.AuthorUpdateRequest;
import book.backend.models.entities.Author;
import book.backend.models.global.ApiResult;
import book.backend.repositories.AuthorRepository;
import book.backend.services.interfaces.IAuthorServices;

@Service
public class AuthorServices implements IAuthorServices {
    private final AuthorRepository authorRepository;

    public AuthorServices(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }
    @Override
    public ApiResult<AuthorResponse> getAuthorDetail(Long id) {
        Author author = authorRepository.findById(id)
            .orElseThrow(() -> new UserMessageException("Tác giả không tồn tại"));
        AuthorResponse response = new AuthorResponse(
            author.getId(),
            author.getAuthorname(),
            author.getBirthYear(),
            author.getNationality(),
            author.getCreatedAt()
        );
        return ApiResult.success(response, "Lấy thông tin tác giả thành công");
    }

    @Override
    public ApiResult<List<AuthorResponse>> getsAuthor() {
        List<Author> authors = authorRepository.findAll();
        List<AuthorResponse> responseList = authors.stream()
                .map(author -> new AuthorResponse(author.getId(), author.getAuthorname(), author.getBirthYear(), author.getNationality(), author.getCreatedAt()))
                .sorted(Comparator.comparing(AuthorResponse::getCreatedAt).reversed())
                .toList();
        return ApiResult.success(responseList, "Lấy danh sách tác giả thành công");
    }


    @Override
    public ApiResult<Long> createAuthor(AuthorRequest request) {
        Author author = new Author();
        author.setAuthorname(request.getAuthorname());
        author.setNationality(request.getNationality());
        author.setBirthYear(request.getBirthYear());

        authorRepository.save(author);
        return ApiResult.success(author.getId(), "Tạo tác giả thành công");
    }

    @Override
    public ApiResult<String> updateAuthor(Long id, AuthorUpdateRequest apiRequest) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new UserMessageException("Tác giả không tồn tại"));

        author.setAuthorname(apiRequest.getAuthorname());
        author.setNationality(apiRequest.getNationality());
        author.setBirthYear(apiRequest.getBirthYear());
        authorRepository.save(author);
        return ApiResult.success(null, "Cập nhật tác giả thành công");
    }
    @Override
    public ApiResult<String> deleteAuthor(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new UserMessageException("Tác giả không tồn tại"));
        authorRepository.delete(author);

        return ApiResult.success(null, "Xóa tác giả thành công");
    }
}
