const activeSchedules = new Map<number, NodeJS.Timeout>();

export function scheduleCampaign(
  id: number,
  frequency: number,
  sendFn: () => Promise<void>
) {
  // Evita duplicar timers
  if (activeSchedules.has(id)) return;

  const interval = setInterval(async () => {
    try {
      await sendFn();
    } catch (err) {
      console.error(`❌ Error al enviar campaña ${id}:`, err);
    }
  }, frequency * 1000);

  activeSchedules.set(id, interval);
}

export function stopCampaign(id: number) {
  const interval = activeSchedules.get(id);
  if (interval) {
    clearInterval(interval);
    activeSchedules.delete(id);
  }
}
