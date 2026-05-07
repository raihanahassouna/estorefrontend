const API_URL = "http://localhost:8080/api/users";

const getToken = () => localStorage.getItem("token");

const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const profileService = {

  async get() {

    const user = getUser();

    console.log("CONNECTED USER =", user);

    const response = await fetch(
      `${API_URL}/${user.id}/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        }
      }
    );

    if (!response.ok) {
      throw new Error("Erreur chargement profil");
    }

    return await response.json();
  },

  async update(profileData) {

    const user = getUser();

    const response = await fetch(
      `${API_URL}/${user.id}/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(profileData)
      }
    );

    if (!response.ok) {
      throw new Error("Erreur sauvegarde");
    }

    return await response.json();
  }
};