
# 📡 TelecomSystem

Sistema de Gestão de Telecomunicações desenvolvido com ASP.NET Core (.NET 6+), PostgreSQL e Angular.  
Este projeto visa o gerenciamento de contratos, operadoras, faturas e muito mais, com foco em escalabilidade, manutenibilidade e segurança.

---

## 🧱 Tecnologias Utilizadas

- **Backend**: ASP.NET Core 6+, C#, Entity Framework Core
- **Banco de Dados**: PostgreSQL
- **Frontend**: Angular 17+
- **Arquitetura**: Clean Architecture, DDD, SOLID
- **Autenticação**: JWT
- **Envio de E-mails**: MailKit

---

## 🚀 Como rodar o projeto localmente

### 📦 Clonando o repositório

```bash
git clone https://github.com/TiagoeSouza/TelecomSystem.git
cd TelecomSystem
```

---

### 🐳 Rodando com Docker (Recomendado)

O projeto inclui um ambiente Docker para execução do banco de dados:

```bash
docker-compose up --d
```

Isso iniciará:

- PostgreSQL em `localhost:5432` com:
  - **Banco**: `TelecomDB`
  - **Usuário**: `postgres`
  - **Senha**: `123456`

---

## 🧪 Rodando manualmente a API

### ⚙️ Pré-requisitos

- [.NET 6 SDK](https://dotnet.microsoft.com/en-us/download)
- [PostgreSQL](https://www.postgresql.org/)

### 🔧 Configuração do Banco

Crie o banco manualmente com o nome `TelecomDB`, ou configure o nome desejado em:

```json
// TelecomSystem.API/appsettings.Development.json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=TelecomDB;Username=postgres;Password=123456"
}
```

### 📥 Aplicar as migrations

```bash
cd TelecomSystem.Infrastructure
dotnet ef database update
```

### ▶️ Iniciar a API

```bash
cd ../TelecomSystem.API
dotnet run
```

API disponível em:

- http://localhost:5009

---

## 🌱 Dados iniciais (Seed)

Ao rodar a aplicação pela primeira vez, o método de **Seed** (`TelecomDbContext.cs`) é executado automaticamente e popula o banco com:

- **Usuário Tiago Souza**:
  - Email: `tiago.souza@telecomsystem.com`
  - Senha: `123456`
 
- **Usuário Admin**:
  - Email: `admin@telecomsystem.com`
  - Senha: `123456`

- **Dados populados**:
  - 6 Operadoras
  - 3 Filial  
  - 2 Contrato
  - 2 Fatura vinculada

---

## 📨 Configuração de e-mail (MailKit)

Para envio automático de e-mails (ex: notificação de faturas), configure:

```json
"EmailSettings": {
  "SmtpServer": "smtp.gmail.com",
  "SmtpPort": 587,
  "From": "seuemail@gmail.com",
  "Password": "senha_de_app" // Gerada em https://myaccount.google.com/apppasswords
  "Destinatario":"" // Como não vinculei com a empresa, devemos informar o email aqui, para demonstrar a rotina no momento
}
```

> Para enviar e-mails com Gmail:
> - Ative a verificação em duas etapas em sua conta
> - Gere uma senha de aplicativo em: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

> Para enviar e-mails com outro Provedor, necessário verificar as configurações pertinentes para envio por aplicativo de terceiro:
---

## 💻 Como rodar o Frontend Angular

### 📦 Instalar dependências

```bash
cd TelecomSystem.Frontend
npm install
```

### ▶️ Rodar localmente

```bash
ng serve
```

Acesse: `http://localhost:4200`
Projeto de front acessa a API `http://localhost:5009` 


---

## 📁 Estrutura do Projeto

```
TelecomSystem/
│
├── TelecomSystem.API               → Camada de apresentação (controllers, middlewares, workers)
├── TelecomSystem.Application      → Regras de negócio (casos de uso, serviços)
├── TelecomSystem.Domain           → Entidades e contratos (regras de domínio)
├── TelecomSystem.Infrastructure   → Infraestrutura (EF, e-mails, autenticação, migrations)
├── TelecomSystem.Frontend         → Projeto Angular (dashboard, formulários, etc.)
```

---

## ✅ Roadmap

- [x] Login Basico com geração de Token(JWT)
- [x] Cadastro de operadoras, filiais, contratos e faturas
- [x] Envio automático de e-mails para faturas vencendo em 5 dias
- [x] Integração com JWT
- [x] Dashboard com gráficos (frontend Angular)

---

📸 Prints do Sistema

🔐 Login
![image](https://github.com/user-attachments/assets/cd8cd862-930f-4258-90d6-55d3286cfc99)

📊 Dashboard
![image](https://github.com/user-attachments/assets/d944551c-0035-4048-a4aa-c58018bd04d9)

📡 Operadoras
![image](https://github.com/user-attachments/assets/677fd390-122e-4c85-ab65-146db93dfa13)

📁 Cadastro de Contrato
![image](https://github.com/user-attachments/assets/9ac0e295-18ab-40ea-916d-6a1f42945031)

🧾 Listagem de Faturas
![image](https://github.com/user-attachments/assets/2929aa61-1315-4876-b855-b3286abddd23)

---

## 📄 Licença

MIT © [Tiago e Souza](https://github.com/TiagoeSouza)
