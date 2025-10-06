import { ShowErrorToast } from "../Toast/Toast";

export const handleValidationErrors = (details: string[]) => details.map((errorMsg) => ShowErrorToast(errorMsg));
