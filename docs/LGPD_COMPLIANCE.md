# Conformidade LGPD - Relatórios SIGECO

## REL-004: Validação de Conformidade LGPD

### Dados Incluídos nos Relatórios

#### Relatório PDF/Excel - Dados de Visitantes
**Dados Pessoais Incluídos:**
- Nome completo do visitante
- Documento (CPF/RG)
- Destino da visita
- Horários de entrada/saída
- Motivo da visita

**Justificativa Legal:**
- Base legal: Legítimo interesse (Art. 7º, IX da LGPD)
- Finalidade: Controle de acesso e segurança do condomínio
- Necessidade: Dados essenciais para identificação e rastreabilidade

### Controles de Acesso Implementados

1. **Perfil Porteiro:**
   - Acesso apenas a dados de visitantes ativos
   - Visualização limitada ao período de trabalho
   - Sem acesso a histórico completo

2. **Perfil Administrador:**
   - Acesso completo a relatórios históricos
   - Capacidade de exportação de dados
   - Responsável pela gestão de dados

### Medidas de Segurança

1. **Armazenamento:**
   - Dados armazenados localmente (localStorage)
   - Sem transmissão para servidores externos
   - Limpeza automática de registros antigos (>100 registros)

2. **Exportação:**
   - Relatórios gerados localmente no navegador
   - Sem envio de dados para APIs externas
   - Usuário controla onde salvar os arquivos

3. **Retenção:**
   - Dados mantidos apenas enquanto necessário
   - Função de limpeza automática implementada
   - Administrador pode limpar dados manualmente

### Direitos dos Titulares

O sistema permite:
- ✅ **Acesso:** Visualização de dados pessoais
- ✅ **Correção:** Edição de dados cadastrados
- ✅ **Exclusão:** Remoção de registros
- ✅ **Portabilidade:** Exportação em PDF/Excel

### Dados NÃO Incluídos

Para proteção adicional, os relatórios **NÃO** incluem:
- Endereço completo dos moradores
- Telefones de contato
- Emails pessoais
- Dados bancários
- Informações médicas
- Dados biométricos

### Recomendações de Uso

1. **Armazenamento de Relatórios:**
   - Manter arquivos exportados em local seguro
   - Não compartilhar relatórios por email não criptografado
   - Deletar relatórios após uso

2. **Acesso ao Sistema:**
   - Usar senhas fortes
   - Não compartilhar credenciais
   - Fazer logout após uso

3. **Tratamento de Dados:**
   - Coletar apenas dados necessários
   - Informar visitantes sobre coleta de dados
   - Manter registro de acessos

### Conformidade Técnica

✅ **Minimização de Dados:** Apenas dados essenciais são coletados
✅ **Finalidade Específica:** Dados usados apenas para controle de acesso
✅ **Transparência:** Sistema informa sobre coleta de dados
✅ **Segurança:** Dados protegidos contra acesso não autorizado
✅ **Direitos dos Titulares:** Sistema permite exercício de direitos

### Próximas Melhorias

Para conformidade completa, recomenda-se:
1. Implementar termo de consentimento para visitantes
2. Adicionar política de privacidade visível
3. Implementar log de auditoria de acessos
4. Adicionar criptografia de dados em repouso
5. Implementar backup com criptografia

---

**Última Atualização:** Novembro 2024
**Responsável:** Equipe de Desenvolvimento SIGECO
