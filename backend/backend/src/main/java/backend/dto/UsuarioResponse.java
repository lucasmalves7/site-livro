package backend.dto;

import java.time.LocalDateTime;

public class UsuarioResponse {
    private Long id;
    private String email;
    private LocalDateTime dataCadastro;

    public UsuarioResponse() {
    }

    public UsuarioResponse(Long id, String email, LocalDateTime dataCadastro) {
        this.id = id;
        this.email = email;
        this.dataCadastro = dataCadastro;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }
}
