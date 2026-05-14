export const getAuthHeader = (): Record<string, string> => {
  const token = sessionStorage.getItem("token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

export const isAuthenticated = (): boolean => {
  return !!sessionStorage.getItem("token");
};

export const logout = (): void => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};