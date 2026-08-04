package backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @Email(message = "E-mail inválido.")
    @NotBlank(message = "O e-mail é obrigatório.")
    private String email;

    @NotBlank(message = "A senha é obrigatória.")
    private String senha;

    public LoginRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email.toLowerCase().trim();
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
