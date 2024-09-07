export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch('https://your-api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Token de autenticación inválido');
    }

    const data = await response.json();
    return data.valid; // Suponiendo que el servidor responde con un campo `valid`
  } catch (error) {
    console.error('Error al validar el token', error);
    return false;
  }
};