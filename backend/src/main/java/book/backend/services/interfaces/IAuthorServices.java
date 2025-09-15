package book.backend.services.interfaces;

import java.util.List;

import book.backend.models.dtos.author.AuthorRequest;
import book.backend.models.dtos.author.AuthorResponse;
import book.backend.models.dtos.author.AuthorUpdateRequest;
import book.backend.models.global.ApiResult;

public interface IAuthorServices {
    ApiResult<AuthorResponse> getAuthorDetail(Long id);
    ApiResult<List<AuthorResponse>> getsAuthor();
    ApiResult<Long> createAuthor(AuthorRequest request);
    ApiResult<String> updateAuthor(Long id, AuthorUpdateRequest apiRequest);
    ApiResult<String> deleteAuthor(Long id);
}
