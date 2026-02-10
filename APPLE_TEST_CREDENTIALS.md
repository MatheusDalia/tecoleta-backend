# Credenciais de Teste - Apple App Review

## Conta de Administrador (Tecomat)

**Email:** admin@tecomat.com  
**Senha:** TecoTest2026!

**Tipo de Conta:** Admin (tecomat)  
**Permissões:** Acesso completo ao sistema, gerenciamento de serviços

---

## Conta de Construtora (Usuário Regular)

**Email:** construtora@teste.com  
**Senha:** TecoTest2026!

**Tipo de Conta:** Construtora  
**Permissões:** Gerenciamento de obras e atividades

---

## Notas Importantes

1. **Email Verificado:** Todas as contas de teste têm o email verificado por padrão
2. **Dados de Teste:** O sistema inclui alguns serviços padrão criados pela conta admin
3. **Reset de Senha:** A funcionalidade de reset de senha está disponível, mas requer configuração de email
4. **Acesso à API:** Após login, o sistema retorna um token JWT que deve ser usado no header `Authorization: Bearer <token>`

---

## Endpoints de Autenticação

- **Login:** POST `/api/auth/login`
- **Registro:** POST `/api/auth/register` (não requer autenticação)
- **Verificar Token:** GET `/api/auth/verify` (requer token)

---

## Estrutura de Dados de Teste

### Admin (admin@tecomat.com):

- Pode criar, editar e gerenciar serviços
- Pode visualizar todas as obras do sistema
- Tem acesso a funcionalidades administrativas

### Construtora (construtora@teste.com):

- Pode criar e gerenciar suas próprias obras
- Pode adicionar colaboradores às obras
- Pode criar atividades e vincular serviços

---

**Última Atualização:** 10 de fevereiro de 2026
