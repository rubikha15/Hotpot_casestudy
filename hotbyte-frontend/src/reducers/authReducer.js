export const loginInitialState = {
  email: "",
  password: "",
};

export const forgotInitialState = {
  email: "",
};

export const resetInitialState = {
  email: "",
  token: "",
  newPassword: "",
};

export function formReducer(state, action) {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "RESET":
      return action.payload;

    default:
      return state;
  }
}