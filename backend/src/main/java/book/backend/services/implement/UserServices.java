package book.backend.services.implement;


import book.backend.models.global.ApiResult;
import book.backend.repositories.UserRepository;
import book.backend.services.interfaces.IUserServices;

import java.util.Comparator;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import book.backend.controllers.exceptions.UserMessageException;
import book.backend.models.dtos.user.UserGetsResponse;
import book.backend.models.dtos.user.UserRequest;
import book.backend.models.dtos.user.UserUpdateRequest;
import book.backend.models.entities.User;

@Service
public class UserServices implements IUserServices {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServices(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public ApiResult<List<UserGetsResponse>> getsUser() {
        List<User> users = userRepository.findAll();
        List<UserGetsResponse> responseList = users.stream()
                .map(user -> new UserGetsResponse(user.getId(), user.getUsername(), user.getRole(), user.getFullName(), user.getCreatedAt().toString()))
                .sorted(Comparator.comparing(UserGetsResponse::getCreatedAt).reversed()) 
                .toList();
    
        return ApiResult.success(responseList, "Lấy danh sách người dùng thành công");
    }

    @Override
    public ApiResult<Long> createUser(UserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setFullName(request.getFullName());
        userRepository.save(user);
        return ApiResult.success(user.getId(), "Tạo người dùng thành công");  
    }

    @Override
    public ApiResult<UserGetsResponse> getUserDetail(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserMessageException("Người dùng không tồn tại"));
        UserGetsResponse response = new UserGetsResponse(
            user.getId(),
            user.getUsername(),
            user.getRole(),
            user.getFullName(),
            user.getCreatedAt().toString()
        );
        return ApiResult.success(response, "Lấy thông tin người dùng thành công");
    }

    @Override
    public ApiResult<String> updateUser(Long userId, UserUpdateRequest apiRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserMessageException("Người dùng không tồn tại"));

        user.setUsername(apiRequest.getUsername());
        user.setRole(apiRequest.getRole());
        user.setFullName(apiRequest.getFullName());
        userRepository.save(user);
        return ApiResult.success(null, "Cập nhật người dùng thành công");
    }
    @Override
    public ApiResult<String> deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserMessageException("Người dùng không tồn tại"));
        userRepository.delete(user);
        return ApiResult.success(null, "Xoá người dùng thành công");
    }

}
