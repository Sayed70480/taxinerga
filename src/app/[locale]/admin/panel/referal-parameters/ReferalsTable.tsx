"use client";

import Admin_Axios from "@/admin/Admin_Axios";
import { ReferalListResponse, ReferalResponseItem } from "@/app/api/admin/referal/route";
import Input from "@/components/forms/Input";
import { useEffect, useState } from "react";

const ReferalsTable = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [data, setData] = useState<ReferalResponseItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await Admin_Axios.get<ReferalListResponse>("/referal");
        const data = response.data;
        setData(data.data);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        setError(error.response.data.message || "Error loading data");
      }
    };
    fetchDrivers();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await Admin_Axios.get<ReferalListResponse>("/referal", {
          params: { page, search },
          signal: controller.signal,
        });
        setData(response.data.data);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error: any) {
        if (error.name !== "CanceledError") {
          setError(error.response?.data?.message || "Error loading data");
          setLoading(false);
        }
      }
    }, 2000);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [page, search]);

  if (loading) {
    return <div>იტვირტება...</div>;
  } else {
    return (
      <div className="flex flex-col">
        <h1 className="mt-8 text-3xl">რეფერალები</h1>
        {error && <p className="text-red-500">{error}</p>}
        <Input
          label="ძებნა"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <div>
          <p>გვერდები</p>
          <div className="flex items-center gap-3">
            <p>გვერდები: {data.length}</p>
            <div>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button key={pg} className={`border-gray-300 border-2 px-3 py-2 text-white ${pg === page ? "bg-yellow" : "bg-gray-300"}`} onClick={() => setPage(pg)}>
                  {pg}
                </button>
              ))}
            </div>
          </div>
        </div>
        {data.map((item) => (
          <div key={item.inviter.driverId} className="border-gray-300 mt-5 flex flex-col items-center justify-between gap-5 border-b-2 p-4 lg:flex-row">
            <div className="text-yellow">
              <p>
                {item.inviter.firstName} {item.inviter.lastName}
              </p>
              <p>{item.inviter.phone}</p>
              <p>{item.inviter.balance.toFixed(2)} ₾</p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs lg:text-sm">
              {item.referals.map((ref) => (
                <div key={ref.phone}>
                  <p>
                    {ref.firstName} {ref.lastName}
                  </p>
                  <p>{ref.phone}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default ReferalsTable;
