import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import NotificationsList from "./NotificationsList";

export default function NotificationsDropdown({
  open,
  onClose,
  anchorRef,
}: {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose, anchorRef]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
          className="absolute right-[100px] mt-2 w-fit bg-background border border-border rounded-lg shadow-lg z-50"
          style={{ top: "100%" }}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
        >
          <div className="p-2 border-b font-semibold">Notifications</div>
          <NotificationsList />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
