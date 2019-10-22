export const isAuthenticated = () => sessionStorage.getItem("token") !== null;

export const getToken = () => sessionStorage.getItem("token");

export const login = token => {
  sessionStorage.setItem("token", token);
};

export const logout = () => {
  sessionStorage.removeItem("token");
};
