import { handleValidationErrors } from "@/components/ErrorDisplay/ValidationErrors";
import { ShowErrorToast, ShowSuccessToast } from "@/components/Toast/Toast";
import { useCreateSupportTicketsMutation, useGetSingleSupportQuery, useGetSupportTicketsQuery, useUpdateSupportMutation } from "@/Redux/Support/SupportSlice";

export const useCreateTicketHandler = () => {
  const [CreateSupportAPI, { isLoading, isError, isSuccess }] = useCreateSupportTicketsMutation();

  const CreateTicketHandler = async ({ Token, CreatedBy, title, description, images }: { Token: string; CreatedBy: string; title: string; description: string; images: any }) => {
    if (!title) {
      return ShowErrorToast("Please enter title of ticket");
    }

    if (!description) {
      return ShowErrorToast("Please enter description of ticket");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    // formData.append("images", images);

    const res = await CreateSupportAPI({
      CreatedBy,
      Token,
      data: formData,
    });

    if (!res.error) {
      ShowSuccessToast("Your ticket has been created successfully. Please wait for the admin’s response.");
    } else {
      handleValidationErrors((res.error as any)?.data?.details);
    }
  };

  return { CreateTicketHandler, isLoading, isError, isSuccess };
};

export const useGetSupportHandler = ({ Token, AdminID }: { Token: string; AdminID: string }) => {
  const { data, isError, isLoading } = useGetSupportTicketsQuery({ Token, AdminID });

  return { data, isError, isLoading };
};

export const useGetSingleSupportHandler = ({ Token, AdminID, TicketID }: { Token: string; AdminID: string; TicketID: string }) => {
  const { data, isError, isLoading } = useGetSingleSupportQuery({ Token, AdminID, TicketID });

  return { data, isError, isLoading };
};

export const useUpdateSupportHandler = () => {
  const [UpdateSupportAPI, { isLoading, isError, isSuccess }] = useUpdateSupportMutation();

  const UpdateStatusHandler = async ({ Token, AdminID, TicketID, status }: { Token: string; AdminID: string; TicketID: string; status: string }) => {
    const res = await UpdateSupportAPI({
      AdminID,
      data: { status },
      TicketID,
      Token,
    });

    if (!res.error) {
      ShowSuccessToast("Status Updated Successfully");
    } else {
      handleValidationErrors((res.error as any)?.data?.details);
    }
  };

  return { UpdateStatusHandler, isLoading, isError, isSuccess };
};
