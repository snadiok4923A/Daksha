/** Short random id with a readable prefix: uid('proj') -> 'proj_k3j9x2a'. */
export const uid = (prefix = 'id') => `${prefix}_${Math.random().toString(36).slice(2, 9)}`
