"use client";
import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  instantMeeting?: boolean;
  image?: string;
  buttonClassName?: string;
  buttonIcon?: string;
}

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  className,
  children,
  handleClick,
  buttonText,
  image,
  buttonIcon,
}: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-[520px] flex-col bg-card backdrop-blur-lg gap-6 border-none px-6 py-9 text-white">
        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <Image src={image} alt="checked" width={72} height={72} />
            </div>
          )}
          <DialogTitle
            className={cn(
              "text-3xl font-bold leading-[42px] text-black/75 dark:text-white",
              className,
            )}
          >
            {title}
          </DialogTitle>
          {children}
          <Button
            className={
              "text-black/75 dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
            }
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image
                src={buttonIcon}
                alt="button icon"
                width={21}
                height={21}
              />
            )}{" "}
            &nbsp;
            {buttonText || "Schedule Meeting"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
