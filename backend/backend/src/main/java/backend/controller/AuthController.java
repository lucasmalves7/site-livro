package backend.controller;

import backend.dto.RegisterRequest;
import backend.entity.Usuario;
import backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import backend.dto.UsuarioResponse;
import backend.dto.LoginRequest;
import backend.dto.LoginResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> cadastrar(
            @Valid @RequestBody RegisterRequest request) {

        try {

            UsuarioResponse usuario = usuarioService.cadastrar(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(usuario);

        } catch (RuntimeException e) {

            if ("Já existe um usuário com este e-mail.".equals(e.getMessage())) {

                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body("Este e-mail já possui cadastro.");
            }

            throw e;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody @Valid LoginRequest request) {

        LoginResponse response = usuarioService.login(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> usuarioAtual() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        UsuarioResponse usuario = usuarioService.buscarPorEmail(email);

        return ResponseEntity.ok(usuario);
    }
}
