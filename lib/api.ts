import type { FundDerivSuccess } from "./actions/types/action";
import { ENV } from "./env";
import { fetchHandler } from "./handlers/fetch";

const API_BASE_URL = ENV.NEXT_PUBLIC_API_BASE_URL;

const SHARED_API_URL = ENV.SHARED_API_URL;

export const api = {
  users: {
    getById: async (id: string) => {
      return await fetchHandler<User>(`${API_BASE_URL}/users/${id}`);
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
      return await fetchHandler<FundDerivSuccess>(
        `${SHARED_API_URL}/deriv/deriv-deposit`,
        {
          method: "POST",
          body: JSON.stringify({
            transactionId,
          }),
          headers: {
            Authorization: `Bearer ${ENV.SHARED_API_TOKEN_CLIENT}`,
          },
        },
      );
    },

    confirmClientWithdraw: async (transactionId: string) => {
      return await fetchHandler<undefined>(
        `${SHARED_API_URL}/confirm-deriv-withdraw`,
        {
          method: "POST",
          body: JSON.stringify({
            transactionId,
          }),
          headers: {
            Authorization: `Bearer ${ENV.SHARED_API_TOKEN_CLIENT}`,
          },
        },
      );
    },

    declineDerivDeposit: async (
      transactionId: string,
      actorId: string,
      reason: string,
    ) => {
      return await fetchHandler<null>(
        `${SHARED_API_URL}/transaction/mark-failed`,
        {
          method: "POST",
          body: JSON.stringify({
            transactionId,
            reason,
            actorId,
          }),
          headers: {
            Authorization: `Bearer ${ENV.SHARED_API_TOKEN_CLIENT}`,
          },
        },
      );
    },
  },
};
