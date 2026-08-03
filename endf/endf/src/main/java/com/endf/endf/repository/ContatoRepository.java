package com.endf.endf.repository;

import com.endf.endf.model.Contato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//O repositório é a interface responsável por interagir diretamente com o banco de dados.
// O Spring Data JPA já fornece métodos prontos como save(), findAll(), findById(), etc.

@Repository
public interface ContatoRepository extends JpaRepository<Contato, Long> {
    // Métodos padrão do CRUD já estão inclusos automaticamente!

}
