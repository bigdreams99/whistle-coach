export function generatePlanTextSummary(plan, config, sport, ageInfo) {
  let summary = `${sport} Training Plan\n${ageInfo?.label || config.ageGroup} • ${config.playerCount} players • ${plan.reduce((sum, p) => sum + p.phaseDuration, 0)} minutes\n`;
  if (config.focusAreas.length > 0) summary += `Focus: ${config.focusAreas.join(", ")}\n`;
  summary += `\n${"─".repeat(60)}\n\n`;
  plan.forEach((drill, idx) => {
    let runningTime = 0;
    for (let j = 0; j < idx; j++) runningTime += plan[j].phaseDuration;
    summary += `${drill.phaseLabel.toUpperCase()} (${runningTime}'–${runningTime + drill.phaseDuration}')\nDrill: ${drill.name}\nDuration: ${drill.phaseDuration} min\n\nDescription:\n${drill.description}\n`;
    if (drill.coaching?.length > 0) summary += `\nCoaching Points:\n${drill.coaching.map(p => `• ${p}`).join("\n")}\n`;
    if (drill.equipment?.length > 0) summary += `Equipment: ${drill.equipment.join(", ")}\n`;
    if (drill.players) summary += `Players: ${drill.players[0]}–${drill.players[1]}\n`;
    summary += `\n${"─".repeat(60)}\n\n`;
  });
  return summary;
}

export function generatePrintHTML(plan, config, sport, ageInfo) {
  const totalTime = plan.reduce((sum, p) => sum + p.phaseDuration, 0);
  const phaseLabels = { "Warm-Up": "warmup", "Technical": "technical", "Tactical": "tactical", "Game": "game", "Cool-Down": "cooldown" };
  const phaseColorMap = { warmup: "#f59e0b", technical: "#3b82f6", tactical: "#8b5cf6", game: "#22c55e", cooldown: "#06b6d4" };
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${sport} Training Plan</title><style>body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 20px; background: white; } .plan-container { max-width: 850px; margin: 0 auto; } .plan-header { margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; } .plan-header h1 { font-size: 28px; font-weight: 700; margin: 0 0 8px 0; color: #0f172a; } .plan-header p { margin: 4px 0; font-size: 14px; color: #475569; } .phase-bar { display: flex; border-radius: 6px; overflow: hidden; height: 12px; margin: 16px 0; background: #f1f5f9; } .drill-card { margin-bottom: 24px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; page-break-inside: avoid; } .drill-header { display: flex; align-items: center; margin-bottom: 14px; gap: 12px; } .drill-time-badge { width: 44px; height: 44px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0; } .drill-title { flex: 1; } .drill-phase { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; } .drill-name { font-size: 18px; font-weight: 600; color: #1e293b; margin: 0; } .drill-description { color: #475569; font-size: 14px; line-height: 1.6; margin: 12px 0; } .coaching-points { margin: 12px 0; } .coaching-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; } .coaching-list { list-style: none; padding: 0; margin: 0; } .coaching-list li { font-size: 13px; color: #334155; margin-bottom: 6px; padding-left: 16px; position: relative; } .coaching-list li:before { content: "•"; position: absolute; left: 0; } .drill-details { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px; font-size: 12px; } .detail-badge { padding: 6px 12px; background: #f1f5f9; border-radius: 6px; color: #475569; } @media print { body { margin: 0; padding: 0; } .drill-card { page-break-inside: avoid; break-inside: avoid; } @page { margin: 0.5in; } }</style></head><body><div class="plan-container"><div class="plan-header"><h1>${sport} Training Plan</h1><p><strong>${ageInfo?.label || config.ageGroup}</strong> • ${config.playerCount} players • ${totalTime} minutes</p>${config.focusAreas.length > 0 ? `<p><strong>Focus:</strong> ${config.focusAreas.join(", ")}</p>` : ""}${ageInfo?.philosophy ? `<p style="font-style: italic; color: #16a34a; margin-top: 8px;">${ageInfo.philosophy}</p>` : ""}<div class="phase-bar">${plan.map(p => { const phaseKey = phaseLabels[p.phaseLabel]; const color = phaseColorMap[phaseKey] || "#22c55e"; return `<div style="flex: ${p.phaseDuration}; background: ${color};"></div>`; }).join("")}</div></div>${plan.map((drill, idx) => { const phaseKey = phaseLabels[drill.phaseLabel]; const color = phaseColorMap[phaseKey] || "#22c55e"; let runningTime = 0; for (let j = 0; j < idx; j++) runningTime += plan[j].phaseDuration; return `<div class="drill-card"><div class="drill-header"><div class="drill-time-badge" style="background: ${color}20; color: ${color};">${drill.phaseDuration}'</div><div class="drill-title"><div class="drill-phase" style="color: ${color};">${drill.phaseLabel} • ${runningTime}'–${runningTime + drill.phaseDuration}'</div><h3 class="drill-name">${drill.name}</h3></div></div>${drill.description ? `<p class="drill-description">${drill.description}</p>` : ""}${drill.coaching?.length > 0 ? `<div class="coaching-points"><div class="coaching-label" style="color: ${color};">Coaching Points</div><ul class="coaching-list">${drill.coaching.map(point => `<li>${point}</li>`).join("")}</ul></div>` : ""}<div class="drill-details">${drill.equipment?.length > 0 ? drill.equipment.map(e => `<span class="detail-badge">${e}</span>`).join("") : ""}${drill.players ? `<span class="detail-badge">${drill.players[0]}–${drill.players[1]} players</span>` : ""}</div></div>`; }).join("")}</div></body></html>`;
  return html;
}

export function handleExportPDF(plan, config, sport, ageInfo) {
  const printWindow = window.open("", "", "height=600,width=800");
  const htmlContent = generatePrintHTML(plan, config, sport, ageInfo);
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  setTimeout(() => { printWindow.print(); }, 250);
}

export function handlePrint(plan, config, sport, ageInfo) {
  const printWindow = window.open("", "", "height=600,width=800");
  const htmlContent = generatePrintHTML(plan, config, sport, ageInfo);
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  setTimeout(() => { printWindow.print(); }, 250);
}

export function handleShare(plan, config, sport, ageInfo) {
  const summary = generatePlanTextSummary(plan, config, sport, ageInfo);
  navigator.clipboard.writeText(summary).then(() => alert("Training plan copied to clipboard!")).catch(() => alert("Unable to copy."));
}
