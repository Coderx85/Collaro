"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { MeetingCardProps } from "@/types";
import { CalendarExport } from "../../CalendarExport";

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
  meetingId,
  startTime,
  endTime,
  description,
  location,
}: MeetingCardProps) => {
  const { toast } = useToast();
  const IconDisplay = icon;

  const MAX_TITLE_LENGTH = 40;

  /**
   * Truncate text to a specified maximum length and add ellipsis if it exceeds that length.
   * 
   * @param text The text to be truncated.
   * @param maxLength The maximum length of the text before truncation occurs.
   * @returns The truncated text with an ellipsis if it exceeds the maximum length. 
   * 
   * @example 
   * truncateText("This is a long meeting title that needs to be truncated", 20);
   * // Returns: "This is a long meeti..."
   */
  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <section className="flex h-[250px] w-[500px] flex-col justify-between rounded-xl bg-card dark:bg-card px-5 py-8 transition-transform duration-200 transform hover:scale-105">
      <article className="flex flex-col gap-5">
          <IconDisplay className="text-white" />  
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold text-white truncate max-w-full">
              {truncateText(title, MAX_TITLE_LENGTH)}
            </h1>
            <p className="text-sm font-normal text-white line-clamp-2">{date}</p>
          </div>
        </div>
      </article>
      <article className={cn("flex justify-center relative")}>
        {!isPreviousMeeting && (
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleClick} className="rounded bg-blue px-6 transition-transform duration-150 transform active:scale-95 hover:scale-105">
              {buttonIcon1 && (
                <Image src={buttonIcon1} alt="feature" width={20} height={20} />
                )
              }
              &nbsp; {buttonText}
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({
                  title: "Link Copied",
                });
              }}
              className="bg-dark-4 px-6 transition-transform duration-150 transform active:scale-95 hover:scale-105"
            >
              <Image
                src="/icons/copy.svg"
                alt="feature"
                width={20}
                height={20}
              />
              &nbsp; Copy Link
            </Button>
            {meetingId && startTime && (
              <CalendarExport
                meetingId={meetingId}
                meetingTitle={title}
                startTime={startTime}
                endTime={endTime}
                description={description}
                location={location}
                meetingLink={link}
                variant="outline"
                size="default"
                className="bg-dark-4 border-dark-3 hover:bg-dark-3 hover:shadow-lg transition-shadow duration-200"
              />
            )}
          </div>
        )}
      </article>
    </section>
  );
};

export default MeetingCard;
