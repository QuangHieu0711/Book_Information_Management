package book.backend.services.interfaces;

import org.springframework.security.core.userdetails.UserDetails;

import book.backend.models.dtos.auth.TokenResponse;

public interface ITokenService {
    TokenResponse generateTokens(UserDetails userDetails);

}
