import { ShowErrorToast } from "@/components/Toast/Toast";
import { useGetTransactionQuery } from "@/Redux/Transaction/TransactionSlice";

export const useGetTransactionAPI = ({ Token, id, page, limit, search }: { Token: string; id: string; page: number; limit: number; search: string }) => {
  const { data, isError, isLoading } = useGetTransactionQuery({ Token, id, page, limit, search });

  return { data, isError, isLoading };
};
