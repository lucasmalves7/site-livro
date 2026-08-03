package com.endf.endf.model;
import jakarta.persistence.*;
import lombok.Data;

//uma classe Java que vai representar a tabela que você quer salvar no SQL Server

@Entity
@Table
@Data
public class Contato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String mensagem;
}
