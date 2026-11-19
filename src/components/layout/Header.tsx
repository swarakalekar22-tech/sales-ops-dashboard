import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  CalendarDays,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  Users,
  LogOut,
  X,
  Settings,
  FileText,
  ShoppingCart,
} from "lucide-react";

import { useSidebar } from "@/components/layout/SidebarContext";
import { useTheme } from "@/lib/theme";
import { recentOrders } from "@/data/mockData";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  title: string;
  description?: string;
}

const notifications = [
  {
    id: 1,
    title: "Order SO-2026-10475 has not dispatched in 48 hours.",
    detail: "Operations team should review the delayed shipment.",
  },
  {
    id: 2,
    title: "Monthly revenue target reached",
    detail: "July revenue crossed the ₹16 Cr target across all regions.",
  },
  {
    id: 3,
    title: "3 deals moved to Negotiation",
    detail: "West India pipeline updated by the sales team.",
  },
];

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export function Header({ title, description }: HeaderProps) {
  const { openMobile } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return [];

    return recentOrders
      .filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.account.toLowerCase().includes(query) ||
          order.owner.toLowerCase().includes(query)
      )
      .slice(0, 6);
  }, [searchQuery]);

  const handleSearchSubmit = () => {
    const query = searchQuery.trim();

    if (!query) return;

    navigate(`/operations?search=${encodeURIComponent(query)}`);
    setSearchQuery("");
    setSearchFocused(false);
  };

  const handleSignOut = () => {
    setSignOutOpen(false);
    navigate("/signed-out");
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
        <button
          type="button"
          onClick={openMobile}
          aria-label="Open menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-semibold leading-none tracking-tight">
            {title}
          </h1>

          {description ? (
            <p className="mt-1.5 hidden truncate text-xs text-muted-foreground sm:block">
              {description}
            </p>
          ) : null}
        </div>

        {/* SEARCH */}
        <div className="relative hidden w-64 lg:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => {
              // Small delay allows clicking a search result.
              setTimeout(() => setSearchFocused(false), 150);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearchSubmit();
              }
            }}
            placeholder="Search accounts, orders…"
            aria-label="Search accounts and orders"
            className="h-9 pl-8 pr-14 text-sm"
          />

          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>

          {/* SEARCH RESULTS */}
          {searchFocused && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-lg border border-border bg-popover shadow-xl">
              {searchResults.length > 0 ? (
                <>
                  <div className="border-b border-border px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Search results
                  </div>

                  {searchResults.map((order) => (
                    <button
                      key={order.id}
                      type="button"
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-accent"
                      onMouseDown={() => {
                        navigate(
                          `/operations?search=${encodeURIComponent(
                            searchQuery.trim()
                          )}`
                        );
                        setSearchQuery("");
                        setSearchFocused(false);
                      }}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                        {order.id
                          .toLowerCase()
                          .includes(searchQuery.trim().toLowerCase()) ? (
                          <ShoppingCart className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {order.account}
                        </span>

                        <span className="block truncate text-xs text-muted-foreground">
                          {order.id} · {order.owner}
                        </span>
                      </span>

                      <span className="text-xs text-muted-foreground">
                        View
                      </span>
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-4 py-5 text-center">
                  <Search className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />

                  <p className="text-sm font-medium">No results found</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Try an account name, order ID, or sales owner.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden items-center gap-1.5 text-xs text-muted-foreground xl:flex">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-1">
          {/* THEME */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={
                  theme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
                onClick={toggleTheme}
              >
                {theme === "dark" ? (
                  <Sun className="h-[18px] w-[18px]" />
                ) : (
                  <Moon className="h-[18px] w-[18px]" />
                )}
              </Button>
            </TooltipTrigger>

            <TooltipContent>
              {theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"}
            </TooltipContent>
          </Tooltip>

          {/* NOTIFICATIONS */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className="relative"
              >
                <Bell className="h-[18px] w-[18px]" />

                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Badge variant="secondary" className="font-normal">
                  {notifications.length} new
                </Badge>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex-col items-start gap-0.5"
                >
                  <span className="text-sm font-medium leading-tight">
                    {notification.title}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {notification.detail}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* PROFILE */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Account menu"
                className="ml-1 rounded-full outline-none ring-offset-background transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>KM</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-medium">Karan Malhotra</p>

                <p className="text-xs font-normal text-muted-foreground">
                  Sales & Ops Director
                </p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onSelect={() => setProfileOpen(true)}>
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={() => setSettingsOpen(true)}>
                <Users className="h-4 w-4" />
                Team settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={() => setSignOutOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* PROFILE MODAL */}
      <Modal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        title="Profile"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>KM</AvatarFallback>
            </Avatar>

            <div>
              <p className="font-semibold">Karan Malhotra</p>
              <p className="text-sm text-muted-foreground">
                Sales & Ops Director
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg border border-border bg-muted/30 p-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Email</span>
              <span>karan.malhotra@pulsegrid.in</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Region</span>
              <span>West India</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Role</span>
              <span>Executive</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Last active</span>
              <span>Today</span>
            </div>
          </div>

          <Button className="w-full" onClick={() => setProfileOpen(false)}>
            Done
          </Button>
        </div>
      </Modal>

      {/* TEAM SETTINGS MODAL */}
      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Team settings"
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-primary" />

              <div>
                <p className="text-sm font-semibold">
                  PulseGrid Sales & Operations
                </p>

                <p className="text-xs text-muted-foreground">
                  12 active team members
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Access
            </p>

            <div className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
              <span>Executive dashboards</span>
              <Badge>Enabled</Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
              <span>Report creation</span>
              <Badge>Enabled</Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
              <span>Team administration</span>
              <Badge>Admin</Badge>
            </div>
          </div>

          <Button className="w-full" onClick={() => setSettingsOpen(false)}>
            Done
          </Button>
        </div>
      </Modal>

      {/* SIGN OUT CONFIRMATION */}
      <Modal
        open={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        title="Sign out"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-destructive/10 p-4 text-sm">
            Are you sure you want to sign out of the PulseGrid demo?
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSignOutOpen(false)}>
              Cancel
            </Button>

            <Button variant="destructive" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}