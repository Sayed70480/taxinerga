import React from "react";
import DriversTable from "./DriversTable";
import AuthorizedDriverModel from "@/services/mongodb/models/AuthorizedDriverModel";
import WithdrawModel from "@/services/mongodb/models/WithdrawModel";
import { YandexDriverInfo } from "@/services/yandex/Yandex_GetDriverByPhone";
import Yandex_TotalDrivers from "@/services/yandex/Yandex_TotalDrivers";
import { unstable_cache } from "next/cache"; // ✅ Caching

export interface DriverTableEntry {
  name: string;
  balance: number;
  status: string;
  firstLogin: Date | null;
  lastLogin: Date | null;
  withdrawn: number | null;
  commissions: number | null;
  phone: string | null;
}

const itemsPerPage = 10; // ✅ Increased for efficiency

const AdminDrivers = async ({ searchParams }: { searchParams: { page?: string; search?: string } }) => {
  const currentPage = Number(searchParams.page) || 1;
  const searchQuery = searchParams.search?.toLowerCase() || "";

  // ✅ Cached driver fetch (prevents re-fetching)
  const data = await unstable_cache(Yandex_TotalDrivers, [], { revalidate: 300 })();

  if (!data) {
    return <div>Failed to fetch drivers</div>;
  }

  // ✅ Filter drivers at the API level if possible
  const filteredDrivers = data.drivers.filter((driver) => {
    const fullName = `${driver.driver_profile.first_name} ${driver.driver_profile.last_name}`.toLowerCase();
    const phone = driver.driver_profile.phones[0] || "";
    return fullName.includes(searchQuery) || phone.includes(searchQuery);
  });

  // ✅ Paginate before fetching additional data
  const paginatedDrivers = filteredDrivers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ✅ Batch fetch related data
  const tableData = await generateTable(paginatedDrivers);

  return <DriversTable drivers={tableData} total={filteredDrivers.length} />;
};

// ✅ Optimized batch fetching with `Promise.all`
async function generateTable(drivers: YandexDriverInfo[]): Promise<DriverTableEntry[]> {
  if (drivers.length === 0) return [];

  const phones = drivers.map((driver) => driver.driver_profile.phones[0]).filter(Boolean);

  // ✅ Parallelize MongoDB queries for performance
  const [authDrivers, withdrawStats] = await Promise.all([AuthorizedDriverModel.find({ phone: { $in: phones } }).lean(), getDriversWithdrawStats(phones)]);

  return drivers.map((driver) => {
    const phone = driver.driver_profile.phones[0];

    return {
      name: `${driver.driver_profile.first_name} ${driver.driver_profile.last_name}`,
      balance: parseFloat(driver.accounts[0]?.balance ?? "0"),
      status: driver.driver_profile.work_status,
      firstLogin: authDrivers.find((auth) => auth.phone === phone)?.createdAt || null,
      lastLogin: authDrivers.find((auth) => auth.phone === phone)?.updatedAt || null,
      withdrawn: withdrawStats.find((stats) => stats.phone === phone)?.totalWithdrawn || null,
      commissions: withdrawStats.find((stats) => stats.phone === phone)?.totalCommission || null,
      phone,
    };
  });
}

// ✅ Efficient Withdraw Stats Query using MongoDB Aggregation
async function getDriversWithdrawStats(phones: string[]) {
  if (phones.length === 0) return [];

  const result = await WithdrawModel.aggregate([{ $match: { phone: { $in: phones }, status: "completed" } }, { $group: { _id: "$phone", totalWithdrawn: { $sum: "$amount" }, totalCommission: { $sum: "$commission" } } }]);

  return result.map((doc) => ({
    phone: doc._id,
    totalWithdrawn: doc.totalWithdrawn,
    totalCommission: doc.totalCommission,
  }));
}

export default AdminDrivers;
