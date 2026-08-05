package backend.service;

import backend.dto.RegisterRequest;
import backend.entity.Usuario;
import backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import backend.dto.UsuarioResponse;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
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

}
