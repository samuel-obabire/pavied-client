import { FundDerivSuccess } from "./actions/types/action";
import { fetchHandler } from "./handlers/fetch";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

  const SHARED_API_URL = process.env.SHARED_API_URL || "https://uneffeminately-nonzoologic-ehtel.ngrok-free.dev/api"

export const api = {
  users: {
    getById: async (id: string) => {
      return await fetchHandler<User>(`${API_BASE_URL}/u sers/${id}`);
    },
    getByEmail: async (email: string) => {
      return await fetchHandler<User>(`${API_BASE_URL}/users/email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },
    create: async (userData: Partial<User>) => {
      return await fetchHandler(`${API_BASE_URL}/users/${userData.id}`, {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
  },
  deriv: {
    triggerCompleteDerivDeposit: async (transactionId: string) => {
      return await fetchHandler<FundDerivSuccess>(`${SHARED_API_URL}/process-deriv-deposit`, {
        method: "POST",
        body: JSON.stringify({
          transactionId,
          source: "client_upload"
        }),
        headers: {
          Authorization: `Bearer ${process.env.SHARED_API_TOKEN_CLIENT!}`
        }
      });
    },
  }
};
