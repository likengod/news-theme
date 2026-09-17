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
          toast: "group toast group-[.toaster]:shadow-lg font-medium",
          description: "group-[.toast]:text-[#141414]/90",
          actionButton: "group-[.toast]:bg-[#141414] group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-black/10 group-[.toast]:text-[#141414]",
          title: "group-[.toast]:text-[#141414] font-semibold",
          error: "group-[.toaster]:!bg-[#1A1110] group-[.toaster]:!text-white",
          success:
            "group-[.toaster]:!bg-[#34C759] group-[.toaster]:!text-[#141414] group-[.toaster]:!border-[#2EAA4C] group-[.toaster]:shadow-md [&_[data-title]]:!text-[#141414] [&_[data-description]]:!text-[#141414] [&_[data-icon]]:!text-[#141414] [&_svg]:!text-[#141414] [&_svg]:!stroke-[#141414]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
