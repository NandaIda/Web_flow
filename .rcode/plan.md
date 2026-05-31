# Plan: Apply Font Size Rules Across the Codebase

Based on analysis of all 5 component files + toolKnowledge data, here are the violations of the new font size rules:

## Violation Categories

### 1. `text-[8px]`, `text-[9px]`, `text-[10px]`, `text-[11px]` — below `text-xs` (12px) absolute floor

These must be bumped to `text-xs` (0.75rem / 12px). Exception: footer build refs at `text-[10px]` are valid **fine print**.

### 2. `leading-tight` (1.25) on paragraph/guidance text — violates 1.5 minimum

### 3. `text-sm` (14px) used as **body/guidance** text — must be `text-base` (16px)

## Files modified (6 files)

1. `src/components/Header.tsx` — 3 changes
2. `src/components/LearnMore.tsx` — 10 changes
3. `src/components/ConversationalFlow.tsx` — 7 changes
4. `src/components/Vibecoder.tsx` — 3 changes
5. `src/components/VisualTopologyNodes.tsx` — 17 changes
6. `src/components/VisualFlowchart.tsx` — 8 changes
