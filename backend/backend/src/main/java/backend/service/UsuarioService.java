package backend.service;

import backend.dto.RegisterRequest;
import backend.entity.Usuario;
import backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import backend.dto.UsuarioResponse;
import backend.dto.LoginRequest;
import backend.dto.LoginResponse;
import backend.security.JwtService;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public UsuarioResponse cadastrar(RegisterRequest request) {

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Já existe um usuário com este e-mail.");
        }

        Usuario usuario = new Usuario();

        usuario.setEmail(request.getEmail());

        usuario.setSenha(
                passwordEncoder.encode(request.getSenha())
        );

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        return new UsuarioResponse(
                usuarioSalvo.getId(),
                usuarioSalvo.getEmail(),
                usuarioSalvo.getDataCadastro()
        );

    }

    public LoginResponse login(LoginRequest request) {

        Optional<Usuario> usuarioOptional =
                usuarioRepository.findByEmail(request.getEmail());

        if (usuarioOptional.isEmpty()) {
            throw new RuntimeException("E-mail ou senha inválidos.");
        }

        Usuario usuario = usuarioOptional.get();

        if (!passwordEncoder.matches(request.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("E-mail ou senha inválidos.");
        }

        String token = jwtService.generateToken(usuario.getEmail());

        return new LoginResponse(
                token,
                usuario.getEmail()
        );
    }

}
