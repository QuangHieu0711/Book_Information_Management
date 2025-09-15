package book.backend.services.implement;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import book.backend.models.dtos.auth.TokenResponse;
import book.backend.models.security.JwtTokenProvider;
import book.backend.services.interfaces.ITokenService;

@Service
public class TokenService implements ITokenService {
    private final JwtTokenProvider tokenProvider;
    

    // Constructor injection
    public TokenService(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    public TokenResponse generateTokens(UserDetails userDetails) {
        String accessToken = tokenProvider.generateAccessToken(userDetails);
        String refreshToken = tokenProvider.generateRefreshToken(userDetails);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.extractExpiration(accessToken).getTime())
                .build();
    }

}
