import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-center"
      className="toaster group"
      toastOptions={{
        style: {
          background: "#1A1110",
          color: "#ffffff",
          border: "1px solid #1A1110",
        },
        classNames: {
          toast:
            "group toast group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-white/80",
          actionButton: "group-[.toast]:bg-white group-[.toast]:text-[#1A1110]",
          cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-white",
          title: "group-[.toast]:text-white",
          error: "group-[.toaster]:!bg-[#1A1110] group-[.toaster]:!text-white",
          success: "group-[.toaster]:!bg-[#1A1110] group-[.toaster]:!text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
