import path from 'path'

interface SkillCommand {
  command: string
  aliases: string[]
  skill: 'gsd' | 'ui-ux' | 'n8n' | 'agent-skills' | 'superpowers'
  handler: (args: string[]) => Promise<string>
  description: string
  autoDetectKeywords: string[]
  priority: number  // Menor = verificado primeiro
}

export class SkillRouter {
  private commands: Map<string, SkillCommand> = new Map()
  private skillsPath = path.join(__dirname)

  constructor() {
    this.registerCommands()
  }

  private registerCommands() {
    // ==================== SUPERPOWERS (priority 1 - muito específicos) ====================
    this.register({
      command: 'brainstorm',
      aliases: ['/brainstorm', '/ideate', 'brainstorm'],
      skill: 'superpowers',
      description: 'Refinar ideias em especificações estruturadas',
      priority: 1,
      autoDetectKeywords: ['brainstorm', 'ideias para', 'como você faria', 'que abordagem', 'me ajuda a pensar', 'spec', 'requirements'],
      handler: async (args) => {
        const idea = args.join(' ')
        return `💡 Superpowers Brainstormer ativado\nIdeia: ${idea}\n\nRefinando em especificação estruturada...\n- Objetivos\n- Requisitos\n- Constraints\n- Critérios de sucesso`
      }
    })

    this.register({
      command: 'tdd',
      aliases: ['/tdd', '/test-driven', 'tdd'],
      skill: 'superpowers',
      description: 'Escrever código com TDD (RED-GREEN-REFACTOR)',
      priority: 1,
      autoDetectKeywords: ['tdd', 'test-driven', 'escrever testes', 'com testes primeiro', 'red green refactor'],
      handler: async (args) => {
        return `🧪 Superpowers TDD ativado\nCiclo RED-GREEN-REFACTOR:\n1. RED: Escrever teste que falha\n2. GREEN: Escrever código mínimo\n3. REFACTOR: Melhorar código`
      }
    })

    this.register({
      command: 'debug-sys',
      aliases: ['/debug-sys', '/systematic-debug'],
      skill: 'superpowers',
      description: 'Debug sistemático 4-phase com root cause analysis',
      priority: 1,
      autoDetectKeywords: ['debug', 'bug', 'está errado', 'não funciona', 'quebrou', 'erro inesperado', 'falha', 'issue'],
      handler: async (args) => {
        return `🔧 Superpowers Systematic Debugger ativado\n4-Phase Root Cause Analysis:\n1. OBSERVE: Reproduzir bug\n2. HYPOTHESIZE: Possíveis causas\n3. TEST: Testar hipóteses\n4. FIX: Implementar solução`
      }
    })

    this.register({
      command: 'code-review-req',
      aliases: ['/code-review', '/review-me', 'code-review'],
      skill: 'superpowers',
      description: 'Solicitar code review com checklist automático',
      priority: 1,
      autoDetectKeywords: ['code review', 'revisar código', 'review do meu código', 'feedback no código', 'olha esse código'],
      handler: async (args) => {
        return `👀 Superpowers Code Review ativado\nPreparing code review request...\n- Auto-checklist: tests, docs, style\n- Performance analysis\n- Security check`
      }
    })

    this.register({
      command: 'worktree',
      aliases: ['/worktree', '/new-branch'],
      skill: 'superpowers',
      description: 'Setup git worktree isolado para feature',
      priority: 1,
      autoDetectKeywords: ['worktree', 'criar branch', 'nova branch', 'branch isolada', 'isolar trabalho'],
      handler: async (args) => {
        const feature = args.join(' ') || 'new-feature'
        return `🌳 Superpowers Git Worktree ativado\nCreating isolated worktree for: ${feature}\n- New branch created\n- Isolated workspace\n- Ready for development`
      }
    })

    this.register({
      command: 'finish-branch',
      aliases: ['/finish-branch', '/merge', 'finish-branch'],
      skill: 'superpowers',
      description: 'Finalizar branch e fazer merge/PR',
      priority: 1,
      autoDetectKeywords: ['finalizar branch', 'fazer merge', 'criar pr', 'pull request', 'concluir feature', 'branch pronta'],
      handler: async (args) => {
        return `✅ Superpowers Branch Finalizer ativado\nFinalizando development branch...\n- Verify all tests pass\n- Create PR\n- Auto-description generated`
      }
    })

    this.register({
      command: 'parallel-agents',
      aliases: ['/parallel', '/agents', 'parallel-agents'],
      skill: 'superpowers',
      description: 'Dispatch múltiplos subagents em paralelo',
      priority: 1,
      autoDetectKeywords: ['paralelo', 'em paralelo', 'múltiplos agentes', 'simultâneo', 'ao mesmo tempo'],
      handler: async (args) => {
        return `⚡ Superpowers Parallel Dispatcher ativado\nDispatchando subagents em paralelo...`
      }
    })

    this.register({
      command: 'verify-fix',
      aliases: ['/verify-fix', 'verify-fix'],
      skill: 'superpowers',
      description: 'Verificar que bug foi resolvido',
      priority: 0,
      autoDetectKeywords: ['verificar fix', 'verificar o fix', 'o bug foi resolvido', 'confirmar correção', 'fix funcionou', 'testar o fix', 'fix do bug'],
      handler: async (args) => {
        return `✓ Superpowers Fix Verifier ativado\nVerificando que fix foi bem-sucedido...\n- Reproduzir cenário original\n- Confirmar bug resolvido\n- Testar edge cases`
      }
    })

    this.register({
      command: 'respond-feedback',
      aliases: ['/respond-feedback', 'respond-feedback'],
      skill: 'superpowers',
      description: 'Responder feedback de code review',
      priority: 1,
      autoDetectKeywords: ['responder feedback', 'responder comentários', 'address feedback', 'feedback do review'],
      handler: async (args) => {
        return `💬 Superpowers Feedback Responder ativado\nAnalisando feedback...\n- Categorizar mudanças\n- Priorizar fixes\n- Implementar respostas`
      }
    })

    this.register({
      command: 'plan-impl',
      aliases: ['/plan-impl', '/implementation-plan', 'plan-impl'],
      skill: 'superpowers',
      description: 'Criar plano de implementação fase-por-fase',
      priority: 1,
      autoDetectKeywords: ['plano de implementação', 'dividir em fases', 'implementação por fases', 'roadmap técnico'],
      handler: async (args) => {
        return `📋 Superpowers Planner ativado\nQuebrando spec em tasks...\n- Fase 1: Analysis\n- Fase 2: Design\n- Fase 3: Implementation\n- Fase 4: Testing`
      }
    })

    // ==================== AGENT-SKILLS (priority 2 - específicos de domínio) ====================
    this.register({
      command: 'deploy',
      aliases: ['/deploy', '/vercel-deploy', 'deploy'],
      skill: 'agent-skills',
      description: 'Deploy para Vercel',
      priority: 2,
      autoDetectKeywords: ['deploy', 'publicar', 'subir para produção', 'vercel', 'colocar em produção', 'fazer deploy'],
      handler: async (args) => {
        return `🚀 Agent-Skills Deploy ativado\nPreparing Vercel deployment...\n- Check performance\n- Run tests\n- Build\n- Deploy preview → production`
      }
    })

    this.register({
      command: 'review-react',
      aliases: ['/react:review', '/review-react', 'review-react'],
      skill: 'agent-skills',
      description: 'Review de componente React (64 best practice rules)',
      priority: 2,
      autoDetectKeywords: ['revisar componente', 'review do componente', 'best practices react', 'otimizar componente', 'melhorar react'],
      handler: async (args) => {
        return `⭐ Agent-Skills React Reviewer ativado\nAplicando 64 rules de best practices...\n- Component patterns\n- Performance\n- Accessibility\n- Code quality`
      }
    })

    this.register({
      command: 'check-performance',
      aliases: ['/perf', '/check-performance', 'check-performance'],
      skill: 'agent-skills',
      description: 'Verificar performance e bundle size',
      priority: 2,
      autoDetectKeywords: ['performance', 'bundle', 'velocidade da página', 'carregamento lento', 'lighthouse', 'bundle size'],
      handler: async (args) => {
        return `📊 Agent-Skills Performance Checker ativado\nAnalisando:\n- Bundle size\n- Load time\n- Runtime performance\n- Lighthouse score`
      }
    })

    // ==================== UI/UX (priority 3 - design) ====================
    this.register({
      command: 'design-system',
      aliases: ['/ui:design-system', '/design', 'design', 'design-system'],
      skill: 'ui-ux',
      description: 'Gerar design system automático para o projeto',
      priority: 3,
      autoDetectKeywords: ['design system', 'cores do projeto', 'identidade visual', 'ui está', 'ux está', 'visual inconsistente', 'melhorar ui', 'melhorar ux', 'feia', 'feio'],
      handler: async (args) => {
        const target = args.join(' ') || 'AgendaVet'
        return `🎨 UI/UX Pro Max ativado\nTarget: ${target}\n\nGerando design system com:\n- Paleta de 161 cores (healthcare pattern)\n- Tipografia profissional\n- 20+ componentes\n- Checklist WCAG-AA`
      }
    })

    this.register({
      command: 'ui-audit',
      aliases: ['/ui:audit', '/audit', 'audit'],
      skill: 'ui-ux',
      description: 'Auditoria de UI/UX e acessibilidade',
      priority: 3,
      autoDetectKeywords: ['auditoria de ui', 'auditar interface', 'revisar acessibilidade', 'verificar contraste', 'problemas de ui', 'audit de ux'],
      handler: async (args) => {
        return `🔍 UI/UX Auditor ativado\nChecking:\n- Consistência de cores\n- Tipografia\n- Acessibilidade (WCAG)\n- Responsividade\n- Anti-patterns`
      }
    })

    // ==================== N8N (priority 4 - patterns) ====================
    this.register({
      command: 'validation-patterns',
      aliases: ['/n8n:validation', '/validate', 'validate'],
      skill: 'n8n',
      description: 'Aplicar padrões robustos de validação N8N',
      priority: 4,
      autoDetectKeywords: ['validação', 'schema de validação', 'validar inputs', 'validar dados', 'validation schema'],
      handler: async (args) => {
        return `🛡️ N8N Validation Expert ativado\nAplicando 4 perfis:\n- minimal: required fields\n- runtime: type checking + required\n- ai-friendly: permissivo\n- strict: máxima validação`
      }
    })

    this.register({
      command: 'error-handling',
      aliases: ['/n8n:errors', '/errors', 'error-patterns'],
      skill: 'n8n',
      description: 'Referência de top 5 padrões de erro (62% dos casos)',
      priority: 4,
      autoDetectKeywords: ['error handling', 'tratar erros', 'padrão de erro', 'exception handling', 'error patterns'],
      handler: async (args) => {
        return `⚠️ N8N Error Handler ativado\nTop 5 padrões de erro (cobrem 62%):\n1. Type mismatch\n2. Null/undefined\n3. Rate limiting\n4. Timeout\n5. External API failure`
      }
    })

    // ==================== GSD (priority 5 - fallback genérico) ====================
    this.register({
      command: 'gsd-execute',
      aliases: ['/gsd:execute', '/execute', 'execute'],
      skill: 'gsd',
      description: 'Executar plano com subagentes especializados',
      priority: 5,
      autoDetectKeywords: ['execute o plano', 'executar o plano', 'seguir o plano', 'próxima fase', 'continuar o plano'],
      handler: async (args) => {
        return `⚙️ GSD Executor ativado\nDispatchando 16 subagentes para executar tarefas do plano...`
      }
    })

    this.register({
      command: 'gsd-debug',
      aliases: ['/gsd:debug'],
      skill: 'gsd',
      description: 'Debug sistemático GSD (16 subagentes)',
      priority: 5,
      autoDetectKeywords: ['debugar com gsd', 'gsd debug', 'debug estruturado'],
      handler: async (args) => {
        return `🐛 GSD Debugger ativado\nPhase 1: Reproduzir\nPhase 2: Isolar\nPhase 3: Investigar causa\nPhase 4: Fix`
      }
    })

    this.register({
      command: 'gsd-verify',
      aliases: ['/gsd:verify', '/verify', 'verify'],
      skill: 'gsd',
      description: 'Verificar implementação contra requisitos (GSD)',
      priority: 5,
      autoDetectKeywords: ['verificar requisitos', 'verificar contra o plano', 'gsd verify', 'checklist de requisitos'],
      handler: async (args) => {
        return `✅ GSD Verifier ativado\nVerificando contra requisitos originais...\nRastreando "verification debt"...`
      }
    })

    // gsd-plan é SEMPRE o último — fallback para qualquer pedido de planejamento
    this.register({
      command: 'gsd-plan',
      aliases: ['/gsd:plan', '/plan', 'plan'],
      skill: 'gsd',
      description: 'Criar plano estruturado para feature/fix (GSD)',
      priority: 10,  // Prioridade mais baixa — fallback final
      autoDetectKeywords: ['criar plano', 'planejamento', 'planejar', 'quero adicionar', 'vou implementar', 'nova feature', 'como implementar', 'como adicionar', 'preciso adicionar', 'preciso criar', 'quero criar', 'vou criar', 'adicionar ao projeto'],
      handler: async (args) => {
        const description = args.join(' ')
        return `🎯 GSD Planner ativado\nDescrição: ${description}\n\nGerando plano estruturado com phases, requisitos e verificação...`
      }
    })
  }

  private register(command: SkillCommand) {
    this.commands.set(command.command, command)
    command.aliases.forEach(alias => {
      this.commands.set(alias, command)
    })
  }

  // Detecção automática por prioridade (menor priority = verificado primeiro)
  detectIntent(userMessage: string): SkillCommand | null {
    const lowerMessage = userMessage.toLowerCase()

    // Ordenar por prioridade antes de verificar
    const sortedCommands = Array.from(this.commands.values())
      .filter((v, i, arr) => arr.findIndex(c => c.command === v.command) === i) // deduplicate
      .sort((a, b) => a.priority - b.priority)

    for (const command of sortedCommands) {
      if (command.autoDetectKeywords.some(keyword => lowerMessage.includes(keyword))) {
        return command
      }
    }
    return null
  }

  // Execução de comando explícito
  async executeCommand(input: string): Promise<string> {
    const parts = input.trim().split(' ')
    const commandName = parts[0]
    const args = parts.slice(1)

    const command = this.commands.get(commandName)
    if (!command) {
      return `❌ Comando desconhecido: ${commandName}\nUse /help para ver comandos disponíveis.`
    }

    return await command.handler(args)
  }

  // Listar comandos disponíveis agrupados por skill
  listCommands(): string {
    const seen = new Set<string>()
    const grouped: { [key: string]: SkillCommand[] } = {}

    Array.from(this.commands.values())
      .sort((a, b) => a.priority - b.priority)
      .forEach(cmd => {
        if (!seen.has(cmd.command)) {
          seen.add(cmd.command)
          if (!grouped[cmd.skill]) grouped[cmd.skill] = []
          grouped[cmd.skill].push(cmd)
        }
      })

    let output = '📚 AGENDAVET SKILLS ROUTER — Comandos Disponíveis\n\n'
    Object.entries(grouped).forEach(([skill, cmds]) => {
      output += `\n[${skill.toUpperCase()}]\n`
      cmds.forEach(cmd => {
        output += `  /${cmd.command} — ${cmd.description}\n`
      })
    })
    return output
  }
}

export const router = new SkillRouter()
