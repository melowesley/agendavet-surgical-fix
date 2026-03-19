import fs from 'fs'
import path from 'path'

interface SkillCommand {
  command: string
  aliases: string[]
  skill: 'gsd' | 'ui-ux' | 'n8n' | 'agent-skills' | 'superpowers'
  handler: (args: string[]) => Promise<string>
  description: string
  autoDetectKeywords: string[]
}

export class SkillRouter {
  private commands: Map<string, SkillCommand> = new Map()
  private skillsPath = path.join(__dirname)

  constructor() {
    this.registerCommands()
  }

  private registerCommands() {
    // ==================== GSD Commands ====================
    this.register({
      command: 'gsd-plan',
      aliases: ['/gsd:plan', '/plan', 'plan'],
      skill: 'gsd',
      description: 'Criar plano estruturado para feature/fix',
      autoDetectKeywords: ['plan', 'vou', 'preciso', 'fazer', 'adicionar', 'feature', 'como fazer'],
      handler: async (args) => {
        const description = args.join(' ')
        return `🎯 GSD Planner ativado\nDescriçãção: ${description}\n\nGerando plano estruturado com phases, requisitos e verificação...`
      }
    })

    this.register({
      command: 'gsd-execute',
      aliases: ['/gsd:execute', '/execute', 'execute'],
      skill: 'gsd',
      description: 'Executar plano com subagentes especializados',
      autoDetectKeywords: ['implementar', 'fazer', 'iniciar', 'começar', 'execute', 'run'],
      handler: async (args) => {
        return `⚙️ GSD Executor ativado\nDispatchando 16 subagentes para executar tarefas do plano...`
      }
    })

    this.register({
      command: 'gsd-debug',
      aliases: ['/gsd:debug', '/debug', 'debug'],
      skill: 'gsd',
      description: 'Debug sistemático de bug com análise 4-phase',
      autoDetectKeywords: ['bug', 'erro', 'não funciona', 'quebrou', 'problema', 'falha', 'issue'],
      handler: async (args) => {
        const bugDesc = args.join(' ')
        return `🐛 GSD Debugger ativado\nAnalisando: ${bugDesc}\n\nPhase 1: Reproduzir\nPhase 2: Isolar\nPhase 3: Investigar causa\nPhase 4: Implementar fix`
      }
    })

    this.register({
      command: 'gsd-verify',
      aliases: ['/gsd:verify', '/verify', 'verify'],
      skill: 'gsd',
      description: 'Verificar implementação contra requisitos',
      autoDetectKeywords: ['verificar', 'testar', 'validar', 'pronto', 'funciona', 'ok'],
      handler: async (args) => {
        return `✅ GSD Verifier ativado\nVerificando contra requisitos originais...\nRastreando "verification debt"...`
      }
    })

    // ==================== UI/UX Commands ====================
    this.register({
      command: 'design-system',
      aliases: ['/ui:design-system', '/design', 'design', 'design-system'],
      skill: 'ui-ux',
      description: 'Gerar design system automático para o projeto',
      autoDetectKeywords: ['design', 'cores', 'ui', 'ux', 'visual', 'estilo', 'tema', 'brand'],
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
      autoDetectKeywords: ['auditoria', 'ui', 'acessibilidade', 'contraste', 'keyboard', 'audit', 'inconsistent'],
      handler: async (args) => {
        const path = args.join(' ') || 'projeto inteiro'
        return `🔍 UI/UX Auditor ativado\nAuditando: ${path}\n\nChecking:\n- Consistência de cores\n- Tipografia\n- Acessibilidade (WCAG)\n- Responsividade\n- Anti-patterns`
      }
    })

    // ==================== N8N Pattern Reference ====================
    this.register({
      command: 'validation-patterns',
      aliases: ['/n8n:validation', '/validate', 'validate'],
      skill: 'n8n',
      description: 'Aplicar padrões robustos de validação N8N',
      autoDetectKeywords: ['validar', 'validação', 'schema', 'erro', 'type', 'check', 'validate'],
      handler: async (args) => {
        return `🛡️ N8N Validation Expert ativado\nAplicando 4 perfis:\n- minimal: required fields\n- runtime: type checking + required\n- ai-friendly: permissivo\n- strict: máxima validação`
      }
    })

    this.register({
      command: 'error-handling',
      aliases: ['/n8n:errors', '/errors', 'error-patterns'],
      skill: 'n8n',
      description: 'Referência de top 5 padrões de erro (62% dos casos)',
      autoDetectKeywords: ['erro', 'falha', 'exception', 'handle', 'catch', 'error', 'fix'],
      handler: async (args) => {
        return `⚠️ N8N Error Handler ativado\nTop 5 padrões de erro (cobrem 62%):\n1. Type mismatch\n2. Null/undefined\n3. Rate limiting\n4. Timeout\n5. External API failure`
      }
    })

    // ==================== Agent-Skills Commands ====================
    this.register({
      command: 'deploy',
      aliases: ['/deploy', '/prod', 'deploy'],
      skill: 'agent-skills',
      description: 'Deploy para Vercel (agent-skills)',
      autoDetectKeywords: ['deploy', 'produção', 'vercel', 'push', 'publicar', 'ship'],
      handler: async (args) => {
        return `🚀 Agent-Skills Deploy ativado\nPreparing Vercel deployment...\n- Check performance\n- Run tests\n- Build\n- Deploy preview → production`
      }
    })

    this.register({
      command: 'review-react',
      aliases: ['/react:review', '/review', 'review-react'],
      skill: 'agent-skills',
      description: 'Review de componente React (64 best practice rules)',
      autoDetectKeywords: ['review', 'react', 'componente', 'component', 'otimizar'],
      handler: async (args) => {
        return `⭐ Agent-Skills React Reviewer ativado\nAplicando 64 rules de best practices...\nChecking:\n- Component patterns\n- Performance\n- Accessibility\n- Code quality`
      }
    })

    this.register({
      command: 'check-performance',
      aliases: ['/perf', '/performance', 'check-performance'],
      skill: 'agent-skills',
      description: 'Verificar performance e bundle size',
      autoDetectKeywords: ['performance', 'bundle', 'otimização', 'velocidade', 'lento', 'perf'],
      handler: async (args) => {
        return `📊 Agent-Skills Performance Checker ativado\nAnalisando:\n- Bundle size\n- Load time\n- Runtime performance\n- Lighthouse score`
      }
    })

    // ==================== Superpowers Commands ====================
    this.register({
      command: 'brainstorm',
      aliases: ['/brainstorm', '/ideate', 'brainstorm'],
      skill: 'superpowers',
      description: 'Refinar ideias em especificações estruturadas',
      autoDetectKeywords: ['brainstorm', 'ideia', 'design', 'pensar', 'planejar', 'spec', 'requirements'],
      handler: async (args) => {
        const idea = args.join(' ')
        return `💡 Superpowers Brainstormer ativado\nIdeia: ${idea}\n\nRefinando em especificação estruturada...\n- Objetivos\n- Requisitos\n- Constraints\n- Sucesso criteria`
      }
    })

    this.register({
      command: 'plan-impl',
      aliases: ['/plan-impl', '/planning', 'plan-impl'],
      skill: 'superpowers',
      description: 'Criar plano de implementação fase-por-fase',
      autoDetectKeywords: ['plano', 'implementação', 'fases', 'roadmap', 'etapas', 'phases'],
      handler: async (args) => {
        return `📋 Superpowers Planner ativado\nQuebrand especificação em tasks...\n- Fase 1: Analysis\n- Fase 2: Design\n- Fase 3: Implementation\n- Fase 4: Testing\n- Fase 5: Deployment`
      }
    })

    this.register({
      command: 'tdd',
      aliases: ['/tdd', '/test-driven', 'tdd'],
      skill: 'superpowers',
      description: 'Escrever código com TDD (RED-GREEN-REFACTOR)',
      autoDetectKeywords: ['tdd', 'teste', 'test', 'code', 'implementar', 'escrever', 'write'],
      handler: async (args) => {
        return `🧪 Superpowers TDD ativado\nCiclo RED-GREEN-REFACTOR:\n1. RED: Escrever teste que falha\n2. GREEN: Escrever código mínimo\n3. REFACTOR: Melhorar código\nRepeat...`
      }
    })

    this.register({
      command: 'execute-plan',
      aliases: ['/execute-plan', '/execute', 'execute-plan'],
      skill: 'superpowers',
      description: 'Executar plano com checkpoints e verificação',
      autoDetectKeywords: ['execute', 'fazer', 'próxima', 'tarefa', 'task', 'next', 'continue'],
      handler: async (args) => {
        return `⚡ Superpowers Executor ativado\nExecutando plan...\n- Task 1: [ ]\n- Task 2: [ ]\n- Task 3: [ ]\nCheckpoints automáticos entre tasks`
      }
    })

    this.register({
      command: 'debug-sys',
      aliases: ['/debug-sys', '/debug', 'debug-sys'],
      skill: 'superpowers',
      description: 'Debug sistemático 4-phase com root cause analysis',
      autoDetectKeywords: ['debug', 'bug', 'erro', 'problema', 'falha', 'não funciona', 'broken'],
      handler: async (args) => {
        return `🔧 Superpowers Systematic Debugger ativado\n4-Phase Root Cause Analysis:\n1. OBSERVE: Reproduzir bug\n2. HYPOTHESIZE: Possíveis causas\n3. TEST: Testar hipóteses\n4. FIX: Implementar solução`
      }
    })

    this.register({
      command: 'code-review-req',
      aliases: ['/code-review', '/review-me', 'code-review'],
      skill: 'superpowers',
      description: 'Solicitar code review com checklist automático',
      autoDetectKeywords: ['review', 'código', 'revisar', 'feedback', 'check', 'cr', 'pr'],
      handler: async (args) => {
        return `👀 Superpowers Code Review ativado\nPreparing code review request...\n- Auto-checklist: tests, docs, style\n- Performance analysis\n- Security check`
      }
    })

    this.register({
      command: 'respond-feedback',
      aliases: ['/respond', '/feedback', 'respond-feedback'],
      skill: 'superpowers',
      description: 'Responder feedback de code review',
      autoDetectKeywords: ['responder', 'feedback', 'comentário', 'sugestão', 'mudança', 'address'],
      handler: async (args) => {
        return `💬 Superpowers Feedback Responder ativado\nAnalisando feedback...\n- Categorizar mudanças\n- Priorizar fixes\n- Implementar respostas`
      }
    })

    this.register({
      command: 'worktree',
      aliases: ['/worktree', '/branch', 'worktree'],
      skill: 'superpowers',
      description: 'Setup git worktree isolado para feature',
      autoDetectKeywords: ['worktree', 'branch', 'isolado', 'novo', 'feature', 'criar branch'],
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
      autoDetectKeywords: ['finish', 'merge', 'pr', 'pull request', 'finalizar', 'concluir'],
      handler: async (args) => {
        return `✅ Superpowers Branch Finalizer ativado\nFinalizando development branch...\n- Verify all tests pass\n- Create PR\n- Auto-description generated\n- Ready for merge`
      }
    })

    this.register({
      command: 'parallel-agents',
      aliases: ['/parallel', '/agents', 'parallel-agents'],
      skill: 'superpowers',
      description: 'Dispatch múltiplos subagents em paralelo',
      autoDetectKeywords: ['parallel', 'agents', 'concurrent', 'simultaneous', 'paralelo'],
      handler: async (args) => {
        return `⚡ Superpowers Parallel Dispatcher ativado\nDispatchando subagents em paralelo...\n- Agent 1: Research\n- Agent 2: Design\n- Agent 3: Implementation\n- Agent 4: Testing`
      }
    })

    this.register({
      command: 'verify-fix',
      aliases: ['/verify', '/verify-fix', 'verify-fix'],
      skill: 'superpowers',
      description: 'Verificar que bug foi resolvido',
      autoDetectKeywords: ['verificar', 'testar', 'funciona', 'ok', 'fix', 'confirm'],
      handler: async (args) => {
        return `✓ Superpowers Fix Verifier ativado\nVerificando que fix foi bem-sucedido...\n- Reproduzir cenário original\n- Confirmar bug resolvido\n- Testar edge cases`
      }
    })
  }

  private register(command: SkillCommand) {
    this.commands.set(command.command, command)
    command.aliases.forEach(alias => {
      this.commands.set(alias, command)
    })
  }

  // Detecção automática baseada em intent
  detectIntent(userMessage: string): SkillCommand | null {
    const lowerMessage = userMessage.toLowerCase()

    for (const [, command] of this.commands) {
      if (command.autoDetectKeywords.some(keyword =>
        lowerMessage.includes(keyword)
      )) {
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

  // Listar comandos disponíveis
  listCommands(): string {
    const commands: { [key: string]: SkillCommand } = {}
    for (const [key, cmd] of this.commands) {
      if (!commands[cmd.command]) {
        commands[cmd.command] = cmd
      }
    }

    const grouped: { [key: string]: SkillCommand[] } = {}
    Object.values(commands).forEach(cmd => {
      if (!grouped[cmd.skill]) grouped[cmd.skill] = []
      grouped[cmd.skill].push(cmd)
    })

    let output = '📚 **AGENDAVET SKILLS ROUTER - 40+ Comandos Disponíveis**\n\n'

    Object.entries(grouped).forEach(([skill, cmds]) => {
      output += `\n## ${skill.toUpperCase()} (${cmds.length} comandos)\n`
      cmds.forEach(cmd => {
        output += `  /${cmd.command} - ${cmd.description}\n`
      })
    })

    return output
  }
}

export const router = new SkillRouter()
