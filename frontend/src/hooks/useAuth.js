import { useState, useEffect } from 'react';

export default function useAuth() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Pega os dados do localStorage quando o componente montar
    const data = localStorage.getItem('userData');
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  // Retorna os dados do usuário (ex: { id: 1, username: 'lucca', role: 'professor' })
  return userData;
}