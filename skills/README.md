# Agent Skills

This directory contains publishable Agent Skills for the LearnSol project.

## Available Skills

- `learn-solana` - teaches Solana concepts from first principles with simple explanations, examples, diagrams, tables, and temporary HTML teaching artifacts.

## Install

Install the skill from this repository:

```bash
npx skills add Some1Uknow/learn-solana --skill learn-solana
```

Install directly from the skill folder:

```bash
npx skills add https://github.com/Some1Uknow/learn-solana/tree/main/skills/learn-solana
```

## Publish Notes

Skills appear on skills.sh through install telemetry after users install them with the `skills` CLI. There is no separate publish command.

The `learn-solana` skill follows the Agent Skills layout:

```text
skills/learn-solana/
  SKILL.md
  agents/openai.yaml
  references/
  assets/
```

