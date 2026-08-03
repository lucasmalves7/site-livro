package com.endf.endf.controller;

//O Controller expõe as portas (endpoints HTTP)
//para receber os dados do front-end via formulário ou requisição AJAX.

import com.endf.endf.model.Contato;
import com.endf.endf.repository.ContatoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contatos")
@CrossOrigin // Permite que o front-end acesse esse endpoint sem bloqueio de CORS
public class ContatoController {

    @Autowired
    private ContatoRepository contatoRepository;

    @PostMapping
    public ResponseEntity<Contato> criarContato(@RequestBody Contato contato) {
        Contato novoContato = contatoRepository.save(contato);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoContato);
    }
}
