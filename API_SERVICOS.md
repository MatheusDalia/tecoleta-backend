# API de Serviços - Documentação

## Visão Geral

A API de Serviços permite que administradores gerenciem serviços personalizados no sistema. Estes serviços são adicionais aos serviços padrão já existentes no frontend.

## Autenticação

Todas as rotas requerem autenticação via JWT token no header `Authorization: Bearer <token>`.

## Endpoints

### 1. Listar Serviços

**GET** `/api/servicos`

Lista todos os serviços ativos do sistema.

**Resposta de Sucesso (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Acabamentos Especiais",
      "descricao": "Acabamentos personalizados e especiais",
      "ativo": true,
      "criadoPor": 1,
      "criadoEm": "2025-01-01T10:00:00.000Z",
      "atualizadoEm": "2025-01-01T10:00:00.000Z",
      "criador": {
        "id": 1,
        "nome": "Admin",
        "email": "admin@tecomat.com"
      }
    }
  ],
  "message": "5 serviços encontrados"
}
```

### 2. Obter Serviço por ID

**GET** `/api/servicos/:id`

Obtém os detalhes de um serviço específico.

**Parâmetros:**

- `id` (number): ID do serviço

**Resposta de Sucesso (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "Acabamentos Especiais",
    "descricao": "Acabamentos personalizados e especiais",
    "ativo": true,
    "criadoPor": 1,
    "criadoEm": "2025-01-01T10:00:00.000Z",
    "atualizadoEm": "2025-01-01T10:00:00.000Z",
    "criador": {
      "id": 1,
      "nome": "Admin",
      "email": "admin@tecomat.com"
    }
  },
  "message": "Serviço encontrado"
}
```

### 3. Criar Novo Serviço

**POST** `/api/servicos`

Cria um novo serviço no sistema.

**Body:**

```json
{
  "nome": "Nome do Serviço",
  "descricao": "Descrição opcional do serviço"
}
```

**Validações:**

- `nome`: Obrigatório, 2-100 caracteres, único
- `descricao`: Opcional, texto livre

**Resposta de Sucesso (201):**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "nome": "Nome do Serviço",
    "descricao": "Descrição opcional do serviço",
    "ativo": true,
    "criadoPor": 1,
    "criadoEm": "2025-01-01T10:00:00.000Z",
    "atualizadoEm": "2025-01-01T10:00:00.000Z",
    "criador": {
      "id": 1,
      "nome": "Admin",
      "email": "admin@tecomat.com"
    }
  },
  "message": "Serviço criado com sucesso"
}
```

### 4. Atualizar Serviço

**PUT** `/api/servicos/:id`

Atualiza um serviço existente.

**Parâmetros:**

- `id` (number): ID do serviço

**Body (todos os campos são opcionais):**

```json
{
  "nome": "Novo Nome do Serviço",
  "descricao": "Nova descrição",
  "ativo": true
}
```

**Resposta de Sucesso (200):**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "nome": "Novo Nome do Serviço",
    "descricao": "Nova descrição",
    "ativo": true,
    "criadoPor": 1,
    "criadoEm": "2025-01-01T10:00:00.000Z",
    "atualizadoEm": "2025-01-01T11:00:00.000Z",
    "criador": {
      "id": 1,
      "nome": "Admin",
      "email": "admin@tecomat.com"
    }
  },
  "message": "Serviço atualizado com sucesso"
}
```

### 5. Desativar Serviço

**DELETE** `/api/servicos/:id`

Desativa um serviço (soft delete). O serviço não é removido, apenas marcado como inativo.

**Parâmetros:**

- `id` (number): ID do serviço

**Resposta de Sucesso (200):**

```json
{
  "success": true,
  "message": "Serviço desativado com sucesso"
}
```

### 6. Reativar Serviço

**PATCH** `/api/servicos/:id/reativar`

Reativa um serviço previamente desativado.

**Parâmetros:**

- `id` (number): ID do serviço

**Resposta de Sucesso (200):**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "nome": "Nome do Serviço",
    "descricao": "Descrição do serviço",
    "ativo": true,
    "criadoPor": 1,
    "criadoEm": "2025-01-01T10:00:00.000Z",
    "atualizadoEm": "2025-01-01T12:00:00.000Z",
    "criador": {
      "id": 1,
      "nome": "Admin",
      "email": "admin@tecomat.com"
    }
  },
  "message": "Serviço reativado com sucesso"
}
```

## Códigos de Erro

### 400 - Bad Request

```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": ["Nome do serviço é obrigatório"]
}
```

### 401 - Unauthorized

```json
{
  "success": false,
  "message": "Token de acesso inválido"
}
```

### 404 - Not Found

```json
{
  "success": false,
  "message": "Serviço não encontrado"
}
```

### 500 - Internal Server Error

```json
{
  "success": false,
  "message": "Erro interno do servidor",
  "error": "Detalhes técnicos do erro"
}
```

## Integração com Frontend

### Sistema Híbrido

O frontend já está configurado para trabalhar com um sistema híbrido:

1. **Serviços Padrão (Hardcoded):** Sempre disponíveis, não podem ser editados
2. **Serviços Extras (API):** Adicionados dinamicamente pelo admin

### Exemplo de Uso no Frontend

```javascript
// Buscar serviços extras da API
const response = await fetch("/api/servicos", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const { data: servicosExtras } = await response.json();

// Combinar com serviços padrão
const todosServicos = [...servicosPadrao, ...servicosExtras];
```

## Observações

- Todos os serviços têm logs detalhados no console do servidor
- O campo `ativo` permite soft delete dos serviços
- A validação de nomes únicos só considera serviços ativos
- O criador do serviço é automaticamente definido pelo usuário logado
