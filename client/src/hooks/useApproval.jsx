import { useAuth } from '../contexts/AuthContext.jsx'
export default function useApproval() {
  const { api } = useAuth()
  async function request(actionType, entity, payload) {
    const { data } = await api.post('/api/approvals', { actionType, entity, payload })
    return data
  }
  return { request }
}
