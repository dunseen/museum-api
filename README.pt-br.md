# 🌿 Herbário Virtual Felisberto Carmago

Plataforma desenvolvida para o gerenciamento, compartilhamento e catalogação de espécies vegetais, com base em dados científicos e taxonômicos.

[![Deploy Status](https://github.com/dunseen/museum-api/actions/workflows/deploy.yml/badge.svg)](https://github.com/dunseen/museum-api/actions)
[![Static Badge](https://img.shields.io/badge/UFRA-2025-green?logo=leaflet&logoColor=white)](https://ufra.edu.br)

<p align="center">
  <img src="./assets/ufra-logo.png" width="100" alt="UFRA Logo"/>
</p>

## 📘 Descrição

O herbário é um acervo de plantas preservadas que serve como referência científica para estudos botânicos, ecológicos e conservacionistas. O herbário Felisberto Camargo da Universidade Federal Rural da Amazônia (UFRA) foi criado em 1976 com o objetivo de coletar, identificar e armazenar exemplares de plantas da região amazônica, bem como promover pesquisas e atividades de ensino.

Neste cenário de importância, as tecnologias podem auxiliar no gerenciamento e disponibilidade global do acervo. Assim, com base em pesquisas realizadas no herbário da UFRA, observou-se a necessidade de aumentar a visibilidade e capacidade de compartilhamento de informações. Portanto, o presente trabalho apresenta uma aplicação web para auxiliar qualquer pessoa com interesse em conhecer o acervo. A proposta refere-se à criação de um Museu virtual, desenvolvido para a exibir todas as espécies do herbário, possibilitando o acesso a informações gerais e especificas sobre o acervo do museu em qualquer local do mundo.

Além do Museu admin que terá como responsabilidade gerenciar todo o fluxo de dados necessário para que os conteúdos possam ser disponibilizados, garantindo a integridade e autenticidade das informações.

> 🚀 O projeto é parte integrante do Trabalho de Conclusão de Curso (TCC) em Sistemas de Informação – Universidade Federal Rural da Amazônia.

## 📚 Documentação

A documentação completa será mantida na Wiki ou `/docs/readme.md`.

## 🌱 Funcionalidades

- [x] Cadastro e consulta de espécies com hierarquia taxonômica.
- [x] Gerenciamento de características botânicas por espécie.
- [x] Upload e visualização de imagens via MinIO.
- [x] Autenticação e controle de acesso com permissões por perfil.
- [x] Suporte a filtros combinados por característica e taxonomia.
- [x] Suporte multilíngue (i18n).
- [x] Integração com Swagger para documentação da API.
- [x] Banco de dados relacional (PostgreSQL + TypeORM).
- [x] Armazenamento em nuvem via MinIO.
- [x] Deploy com Docker e GitHub Actions.

## 🖥️ Stack Tecnológica

- **Backend:** NestJS + TypeORM
- **Frontend:** Next.js + React
- **Banco de Dados:** PostgreSQL
- **Armazenamento de arquivos:** MinIO
- **Containerização:** Docker
- **Deploy:** VPS (Oracle Cloud) + GitHub Actions + Cloudflare + Nginx

## 👥 Contribuidores

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%">
        <img src="https://github.com/dunseen.png" width="100px;" alt="Seu Nome"/>
        <br />
        <sub><b>Davys Lima</b></sub>
        <br />
        <a href="mailto:davysjunior08@hotmail.com">📧</a> <a href="https://github.com/dunseen">💻</a>
      </td>
      <td align="center" valign="top" width="14.28%">
        <img src="https://github.com/denis-junior.png" width="100px;" alt="Seu Nome"/>
        <br />
        <sub><b>Denis Charles</b></sub>
        <br />
        <a href="mailto:denis_jr2001@hotmail.com">📧</a> <a href="https://github.com/denis-junior">💻</a>
      </td>
    </tr>
  </tbody>
</table>

## 🤝 Suporte

Para dúvidas ou sugestões, entre em contato via [GitHub Issues](https://github.com/dunseen/museum-api/issues) ou pelo e-mail institucional.

---
