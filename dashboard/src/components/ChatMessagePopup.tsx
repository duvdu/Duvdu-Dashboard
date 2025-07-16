import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { type FC } from "react";

interface ChatMessagePopupProps {
  open: boolean;
  senderName: string;
  messagePreview: string;
  onView: () => void;
  onClose: () => void;
}

export const ChatMessagePopup: FC<ChatMessagePopupProps> = ({
  open,
  senderName,
  messagePreview,
  onView,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
            minWidth: 260,
            maxWidth: 320,
          }}
        >
          <Card
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              padding: 12,
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              borderRadius: 10,
              background: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 15 }}>
                {senderName || "New message"}
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 2,
                }}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ color: "#555", fontSize: 14, marginBottom: 4 }}>
              {messagePreview}
            </div>
            <Button
              onClick={onView}
              style={{
                alignSelf: "flex-end",
                padding: "4px 12px",
                fontSize: 14,
                height: 28,
              }}
            >
              View
            </Button>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ChatMessagePopup;
