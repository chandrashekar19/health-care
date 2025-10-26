import clsx from "clsx";
import Image from "next/image";

export type StatCardType = "appointments" | "pending" | "cancelled"; // ✅ reusable

type StatCardProps = {
  type: StatCardType;
  count: number;
  label: string;
  icon: string;
};

const StatCard = ({ count = 0, label, icon, type }: StatCardProps) => {
  return (
    <div
      className={clsx(
        "stat-card text-white rounded-xl p-4 flex flex-col justify-between",
        {
          "bg-appointments": type === "appointments",
          "bg-pending": type === "pending",
          "bg-cancelled": type === "cancelled",
        }
      )}
      aria-label={`${label} count`}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          height={32}
          width={32}
          alt={label}
          className="size-8 w-fit"
        />
        <h2 className="text-32-bold">{count}</h2>
      </div>
      <p className="text-14-regular opacity-90">{label}</p>
    </div>
  );
};

export default StatCard;
