# Como Executar Scripts em Produção

## 📋 Pré-requisitos

Você precisa ter acesso SSH ou ao console da plataforma onde o backend está deployado.

---

## 🚀 Opções de Execução

### **Opção 1: Via SSH (Recomendado)**

Se você tem acesso SSH ao servidor:

```bash
# 1. Conectar ao servidor
ssh usuario@seu-servidor.com

# 2. Navegar até a pasta do projeto
cd /caminho/para/backend-app

# 3. Executar o script
node create-test-users.js
```

---

### **Opção 2: Railway / Render / Heroku**

Se está usando uma plataforma como Railway, Render ou Heroku:

#### **Railway:**

```bash
# 1. Instalar Railway CLI (se não tiver)
npm i -g @railway/cli

# 2. Login
railway login

# 3. Linkar ao projeto
railway link

# 4. Executar o script
railway run node create-test-users.js
```

#### **Render:**

```bash
# Via dashboard do Render:
# 1. Acesse o dashboard do Render
# 2. Vá em "Shell" no seu serviço
# 3. Execute: node create-test-users.js
```

#### **Heroku:**

```bash
# 1. Login
heroku login

# 2. Executar comando no dyno
heroku run node create-test-users.js -a nome-do-seu-app
```

---

### **Opção 3: Upload e Execução Manual**

Se você tem acesso FTP/SFTP:

1. **Fazer upload dos arquivos:**
   - `create-test-users.js`
   - Certifique-se que `models/`, `config/` estão presentes

2. **Executar via painel de controle ou SSH:**
   ```bash
   node create-test-users.js
   ```

---

### **Opção 4: Adicionar ao package.json**

Adicione ao `package.json`:

```json
"scripts": {
  "create-test-users": "node create-test-users.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

Depois execute:

```bash
npm run create-test-users
```

---

## ⚠️ Importante

### **Variáveis de Ambiente**

Se seu banco de dados em produção usa variáveis de ambiente diferentes, você pode precisar configurar:

```bash
# Exemplo para PostgreSQL
DATABASE_URL=postgres://usuario:senha@host:5432/database node create-test-users.js
```

### **Verificar Conexão do Banco**

Antes de executar, certifique-se que:

- O banco de dados está acessível
- As credenciais estão corretas
- As tabelas existem (rode as migrations se necessário)

---

## 🔍 Verificar se Funcionou

Após executar, você deve ver:

```
✅ Usuário admin criado: admin@tecomat.com
✅ Usuário construtora criado: construtora@teste.com
```

Para testar o login:

```bash
curl -X POST https://seu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tecomat.com","senha":"TecoTest2026!"}'
```

---

## 🐛 Troubleshooting

**Erro de conexão com banco:**

- Verifique se o arquivo `config/database.js` está usando as credenciais corretas
- Em produção, geralmente usa-se `process.env.DATABASE_URL`

**Script não encontrado:**

- Certifique-se que fez deploy do arquivo `create-test-users.js`
- Verifique se está na pasta correta do projeto

**Usuários já existem:**

- O script verifica automaticamente e não duplica usuários
- Se já existirem, apenas mostrará uma mensagem informativa

---

## 📝 Dica

Se você não sabe qual plataforma está usando, verifique:

- Seu painel de controle onde configurou o deploy
- Variáveis de ambiente configuradas
- URL do servidor (geralmente indica a plataforma)
