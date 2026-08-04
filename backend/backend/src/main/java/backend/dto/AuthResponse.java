package backend.dto;

public class AuthResponse {

    private String token;

    private String tipo;

    public AuthResponse() {
    }

    public AuthResponse(String token) {
        this.token = token;
        this.tipo = "Bearer";
    }

    public String getToken() {
        return token;
    }

    public String getTipo() {
        return tipo;
    }
}
