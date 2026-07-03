import { createContext, useContext, useState } from "react";

const UserContext = createContext();

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return {
      id:
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ],
      email:
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ],
      role:
        payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
      restaurantId: payload.RestaurantId,
    };
  } catch {
    return null;
  }
}

export function UserProvider({ children }) {
  const savedToken = localStorage.getItem("token");
  const [user, setUser] = useState(savedToken ? decodeToken(savedToken) : null);

  const loginUser = (token) => {
    localStorage.setItem("token", token);
    setUser(decodeToken(token));
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);