package book.backend.services.interfaces;

import java.util.List;

import book.backend.models.dtos.user.UserGetsResponse;
import book.backend.models.dtos.user.UserRequest;
import book.backend.models.dtos.user.UserUpdateRequest;
import book.backend.models.global.ApiResult;

public interface IUserServices {
    ApiResult<List<UserGetsResponse>> getsUser();
    ApiResult<UserGetsResponse> getUserDetail(Long userId);
    ApiResult<Long> createUser(UserRequest request);
    ApiResult<String> updateUser(Long userId, UserUpdateRequest apiRequest);
    ApiResult<String> deleteUser(Long userId);
}
