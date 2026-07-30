/** Tag chip color heuristics for executive dark/light theme. */
export function tagClass(label: string): string {
  const t = label.trim();
  if (/需尽快|优先|紧急|催你|阻塞|卡住/.test(t))
    return "bg-[var(--urgent-soft)] text-[var(--urgent)]";
  if (/待你|待发|待打包|待放行|待补|你欠|等你/.test(t))
    return "bg-[var(--action-soft)] text-[var(--action-ink)]";
  if (/待客户|等客户|客户已|3D|外形|OS|图纸|议价|谈判|等PO|等 PO|PO/.test(t))
    return "bg-[var(--wait-soft)] text-[var(--wait-ink)]";
  if (/待工程|待工厂|待沈工|等工程|等工厂|评审|型号|提货日|管位/.test(t))
    return "bg-[var(--primary-soft)] text-[var(--primary)]";
  if (/已发|已回|已转|已下|已用|已出|已 Noted|已确认|够用|关闭|投产|已签/.test(t))
    return "bg-[var(--surface-2)] text-[var(--mute)]";
  if (/知会|旁听|非你|非主|必读|流程|培训|合规|转 Kimmy|会议/.test(t))
    return "bg-[var(--surface-2)] text-[var(--mute)]";
  if (/缺|售后|物流|补发|顶盖|单证|CI|PL|CO/.test(t))
    return "bg-[var(--primary-soft)] text-[var(--primary)]";
  return "bg-[var(--surface-2)] text-[var(--mute)]";
}
