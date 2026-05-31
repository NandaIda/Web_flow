let instance: typeof import('mermaid').default | null = null;

export async function getMermaid() {
  if (instance) return instance;
  const mod = await import('mermaid');
  instance = mod.default;
  instance.initialize({
    startOnLoad: false,
    theme: 'default',
    themeVariables: {
      primaryColor: '#2563EB',
      primaryTextColor: '#18181B',
      primaryBorderColor: '#93C5FD',
      lineColor: '#6B7280',
      secondaryColor: '#F0F9FF',
      background: '#FFFFFF',
      fontSize: '14px',
    },
    flowchart: { curve: 'basis', padding: 12 },
  });
  return instance;
}
