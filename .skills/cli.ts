#!/usr/bin/env ts-node
import { router } from './router'

async function main() {
  const args = process.argv.slice(2)
  const input = args.join(' ')

  // Help command
  if (!input || input === 'help' || input === '--help' || input === '-h') {
    console.log('\n' + '='.repeat(60))
    console.log('AgendaVet Skills Router v1.0.0')
    console.log('='.repeat(60) + '\n')
    console.log(router.listCommands())
    console.log('\n' + '='.repeat(60))
    console.log('Uso:')
    console.log('  cli.ts /comando [args]     - Executar comando explícito')
    console.log('  cli.ts help                - Mostrar comandos disponíveis')
    console.log('='.repeat(60) + '\n')
    process.exit(0)
  }

  // Auto-detect intent
  if (!input.startsWith('/')) {
    const detected = router.detectIntent(input)
    if (detected) {
      console.log(`\n🤖 **Auto-detect ativado!**`)
      console.log(`Detectei que você quer usar: **/${detected.command}**`)
      console.log(`Descrição: ${detected.description}\n`)
      const result = await detected.handler(input.split(' '))
      console.log(result)
      return
    }
  }

  // Execute explicit command
  const result = await router.executeCommand(input)
  console.log('\n' + result + '\n')
}

main().catch((err) => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
