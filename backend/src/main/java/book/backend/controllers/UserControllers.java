package book.backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import book.backend.models.dtos.user.UserGetsResponse;
import book.backend.models.dtos.user.UserRequest;
import book.backend.models.dtos.user.UserUpdateRequest;
import book.backend.models.global.ApiResult;
import book.backend.services.interfaces.IUserServices;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/users")
public class UserControllers extends ApiBaseController {
    private final IUserServices userServices;

    public UserControllers(IUserServices userServices) {
        this.userServices = userServices;
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('admin')")
    @GetMapping
    public ResponseEntity<ApiResult<List<UserGetsResponse>>> getsUser() {
        return executeApiResult(() -> userServices.getsUser());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('admin')")
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResult<UserGetsResponse>> getUserDetail(@PathVariable Long userId) {
        return executeApiResult(() -> userServices.getUserDetail(userId));
    }
    @PreAuthorize("hasRole('ADMIN') or hasRole('admin')")
    @PostMapping
    public ResponseEntity<ApiResult<Long>> createUser(@Valid @RequestBody UserRequest apiRequest) {
        return executeApiResult(() -> userServices.createUser(apiRequest));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('admin')")
    @PutMapping("/{userId}")
    public ResponseEntity<ApiResult<String>> updateUser(@PathVariable Long userId, @Valid @RequestBody UserUpdateRequest apiRequest) {
        return executeApiResult(() -> userServices.updateUser(userId, apiRequest));
    }
    @PreAuthorize("hasRole('ADMIN') or hasRole('admin')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResult<String>> deleteUser(@PathVariable Long userId) {
        return executeApiResult(() -> userServices.deleteUser(userId));
    }

}
