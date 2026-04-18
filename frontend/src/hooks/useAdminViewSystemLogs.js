import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../lib/api/adminApi";
import { queryKeys } from "../lib/react-query/queryKeys";


const useAdminViewSystemLogs = ({ page, entries }) => {
    return useQuery({
      queryKey: queryKeys.admin.logs({ page, entries }), 
      queryFn: () =>
        adminApi.getSystemLogs({
          page,
          per_page: entries,
        }),
      keepPreviousData: true, 
    });
  };
  

export default useAdminViewSystemLogs;