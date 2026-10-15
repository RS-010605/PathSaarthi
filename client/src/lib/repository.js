import { seedCareers, seedContributions } from '../data/seedData'

const CAREERS_KEY = 'pathsaarthi.careers.v1'
const CONTRIBUTIONS_KEY = 'pathsaarthi.contributions.v1'
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const clone = (x) => JSON.parse(JSON.stringify(x))
function getLocal(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    if (value) return JSON.parse(value)
  } catch {}
  localStorage.setItem(key, JSON.stringify(fallback))
  return clone(fallback)
}
function saveLocal(key, value) { localStorage.setItem(key, JSON.stringify(value)); return clone(value) }
async function request(path, options = {}) {
  if (!API_BASE) throw new Error('Local demo mode')
  const response = await fetch(`${API_BASE}${path}`, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options })
  if (!response.ok) throw new Error(`API error (${response.status})`)
  return response.json()
}
export const repository = {
  async getCareers() {
    try { const d = await request('/careers'); if (Array.isArray(d)) return d; if (d.data) return d.data } catch {}
    return getLocal(CAREERS_KEY, seedCareers)
  },
  async getCareer(id) { return (await this.getCareers()).find(c => c.id === id || c.slug === id) || null },
  async saveCareer(career) {
    const all = await this.getCareers()
    const normalized = { ...career, id: career.id || `career-${Date.now()}`, slug: career.slug || career.id || `career-${Date.now()}`, updatedAt: new Date().toISOString() }
    const exists = all.some(c => c.id === normalized.id)
    const next = exists ? all.map(c => c.id === normalized.id ? normalized : c) : [normalized, ...all]
    saveLocal(CAREERS_KEY, next)
    try { await request(exists ? `/admin/careers/${normalized.id}` : '/admin/careers', { method: exists ? 'PATCH' : 'POST', body: JSON.stringify(normalized) }) } catch {}
    return normalized
  },
  async deleteCareer(id) {
    saveLocal(CAREERS_KEY, (await this.getCareers()).filter(c => c.id !== id))
    try { await request(`/admin/careers/${id}`, { method: 'DELETE' }) } catch {}
  },
  async saveRoadmap(careerId, roadmap) {
    const all = await this.getCareers()
    const next = all.map(c => c.id === careerId ? { ...c, roadmap: roadmap.map((s,i) => ({ ...s, sequence: i+1 })) } : c)
    saveLocal(CAREERS_KEY, next)
    try { await request(`/admin/careers/${careerId}/roadmap`, { method: 'PUT', body: JSON.stringify({ roadmap }) }) } catch {}
    return next.find(c => c.id === careerId)
  },
  async getContributions() {
    try { const d = await request('/admin/contributions'); if (Array.isArray(d)) return d; if (d.data) return d.data } catch {}
    return getLocal(CONTRIBUTIONS_KEY, seedContributions)
  },
  async addContribution(input) {
    const all = await this.getContributions()
    const contribution = { ...input, id: `contrib-${Date.now()}`, status: 'pending', reviewNotes: '', createdAt: new Date().toISOString(), contributor: input.contributor || 'Demo Student' }
    saveLocal(CONTRIBUTIONS_KEY, [contribution, ...all])
    try { await request('/contributions', { method: 'POST', body: JSON.stringify(contribution) }) } catch {}
    return contribution
  },
  async updateContribution(id, updates) {
    const all = (await this.getContributions()).map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c)
    saveLocal(CONTRIBUTIONS_KEY, all)
    try { await request(`/admin/contributions/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }) } catch {}
    return all.find(c => c.id === id)
  },
  async resetDemo() {
    localStorage.removeItem(CAREERS_KEY); localStorage.removeItem(CONTRIBUTIONS_KEY)
    return true
  }
}
