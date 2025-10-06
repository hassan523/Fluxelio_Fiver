import { toast } from "react-toastify";

export const ShowErrorToast = (message: string) => {
    toast.error(message || "Something went wrong!", {
        style: {
            fontSize: "0.9rem",
            color: "#721c24",
        },
    });
};

export const ShowSuccessToast = (message: string) => {
    toast.success(message || "Something went wrong!", {
        style: {
            fontSize: "0.9rem",
            color: "#008000c9",
        },
    });
};

export const ShowWarningToast = (message: string) => {
    toast.warning(message || "Something went wrong!", {
        style: {
            fontSize: "0.9rem",
            color: "#ff9900",
        },
    });
};
