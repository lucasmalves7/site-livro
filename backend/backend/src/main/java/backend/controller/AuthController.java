package backend.controller;

import backend.dto.RegisterRequest;
import backend.entity.Usuario;
import backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import backend.dto.UsuarioResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioResponse> cadastrar(
            @Valid @RequestBody RegisterRequest request) {

        UsuarioResponse usuario = usuarioService.cadastrar(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }
}
