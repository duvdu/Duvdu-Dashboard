import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { canAccess } from "@/config/permissions";
import { useRoleSidebar } from "@/contexts/RBACProvider";
import { useModal } from "@/store/modal-store";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function flattenSidebar(items) {
  const flat = [];
  for (const item of items) {
    flat.push(item);
    if (item.children) flat.push(...flattenSidebar(item.children));
  }
  return flat;
}

export function QuickSearchModal() {
  const { isOpen, type, onClose } = useModal();
  const isModalOpen = isOpen && type === "quickSearch";
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const sidebarItems = useRoleSidebar();

  // Filter sidebar items based on permissions
  const filterSidebarItems = (items: typeof sidebarItems) => {
    return items.filter((item) => {
      if (!item.requiredPermissions) return true;
      return canAccess(item.requiredPermissions);
    });
  };

  const filteredSidebarItems = filterSidebarItems(sidebarItems);

  const allItems = useMemo(
    () => flattenSidebar(filteredSidebarItems),
    [filteredSidebarItems]
  );
  const filtered = useMemo(() => {
    if (!query) return allItems;
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.path.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allItems]);

  function handleSelect(item) {
    navigate(item.path);
    onClose();
  }

  if (!isModalOpen) return null;

  return (
    <CommandDialog
      open={isModalOpen}
      onOpenChange={onClose}
      title="Quick Search"
    >
      <CommandInput
        autoFocus
        placeholder="Search for a page..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {filtered.length === 0 && query ? (
          <CommandEmpty>No results found.</CommandEmpty>
        ) : null}
        {filtered.map((item) => (
          <CommandItem
            key={item.path}
            onSelect={() => handleSelect(item)}
            className="flex items-center gap-3"
          >
            {item.icon && (
              <item.icon className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="font-medium">{item.label}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {item.path}
            </span>
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
