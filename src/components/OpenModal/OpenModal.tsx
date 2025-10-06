import React, { useState, ReactNode, Dispatch, SetStateAction } from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import AddOffice from "../Modals/Office/AddOffice";
import dynamic from "next/dynamic";
import Button from "../Button/Button";

interface OpenModalProps {
    ModalName?: string;
    Modal?: ReactNode;
    Btn?: ReactNode;
    isOpen?: boolean;
    isModal?: boolean;
    changeOpen?: Dispatch<SetStateAction<boolean>>;
}

const OpenModal = ({ ModalName, Modal, isOpen, changeOpen, Btn, isModal }: OpenModalProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={isOpen || open} onOpenChange={changeOpen || setOpen}>
            {isModal ? (
                <DialogTrigger asChild>
                    <div>{Btn || <Button name={ModalName || "Add Office"} />}</div>
                </DialogTrigger>
            ) : null}
            {Modal || <AddOffice />}
        </Dialog>
    );
};

export default dynamic(() => Promise.resolve(OpenModal), { ssr: false });
