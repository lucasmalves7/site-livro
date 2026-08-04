package backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @Email(message = "E-mail inválido.")
    @NotBlank(message = "O e-mail é obrigatório.")
    private String email;

    @NotBlank(message = "A senha é obrigatória.")
    @Size(min = 6, message = "A senha deve possuir pelo menos 6 caracteres.")
    private String senha;

    public RegisterRequest() {
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
