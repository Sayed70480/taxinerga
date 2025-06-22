"use client";

import Input from "@/components/forms/Input";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { DriverTableEntry } from "./page";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Extend dayjs with UTC and timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  drivers: DriverTableEntry[];
  total: number;
}

const DriversTable = ({ drivers, total }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const urlSearchQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(total / itemsPerPage);

  // Convert timestamps to UTC+4 (Tbilisi Time)
  const formatDate = (date: Date | null) => (date ? dayjs.utc(date).tz("Asia/Tbilisi").format("YYYY-MM-DD HH:mm:ss") : "-");

  // ✅ Update URL when search input changes (debounced for 2s)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 2000);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // ✅ Sync search param with URL when debouncedSearch updates
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch);
    }

    params.set("page", "1"); // Reset to first page when searching
    router.push(`?${params.toString()}`);
  }, [debouncedSearch,router]);

  // ✅ Update search input state
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // ✅ Update URL when pagination buttons are clicked
  const goToPage = (page: number) => {
    const params = new URLSearchParams();

    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch);
    }

    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="p-4">
      <Input value={searchQuery} onChange={handleSearchChange} label="ძებნა" type="text" placeholder="სახელი, გვარი ან ტელეფონი" />

      {/* Table Header */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-7  gap-4 border-b pb-2 font-semibold">
        <p>მძღოლი</p>
        <p>ნომერი</p>
        <p>ბალანსი</p>
        <p>სტატუსი</p>
        <p>პირველი შესვლა</p>
        <p>ბოლო შესვლა</p>
        <p>გატანილი თანხა</p>
      </div>

      {/* Table Data */}
      {drivers.length > 0 ? (
        drivers.map((driver, index) => (
          <div key={index} className="grid grid-cols-2 lg:grid-cols-7 gap-4 border-b py-2">
            <p>{driver.name}</p>
            <p>{driver.phone || "უცნობია"}</p>
            <p>{driver.balance.toFixed(2)} ₾</p>
            <p>{driver.status}</p>
            <p>{driver.firstLogin ? formatDate(driver.firstLogin) : "არ შემოსულა"}</p>
            <p>{driver.lastLogin ? formatDate(driver.lastLogin) : "არ შემოსულა"}</p>
            <p>{driver.withdrawn ? driver.withdrawn.toFixed(2) + " ₾" : "არ გაუტანია"} </p>
          </div>
        ))
      ) : (
        <p className="mt-4 text-center">მონაცემები არ მოიძებნა.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)} className="bg-gray-200 rounded px-3 py-1 disabled:opacity-50">
            ⬅️
          </button>
          <span>
            გვერდი {currentPage} / {totalPages}
          </span>
          <button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)} className="bg-gray-200 rounded px-3 py-1 disabled:opacity-50">
            ➡️
          </button>
        </div>
      )}
    </div>
  );
};

export default DriversTable;
