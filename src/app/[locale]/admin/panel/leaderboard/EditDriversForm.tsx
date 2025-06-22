"use client";
import Admin_Axios from "@/admin/Admin_Axios";
import Button from "@/components/forms/Button";
import Input from "@/components/forms/Input";
import { useRouter } from "@/i18n/routing";
import { IDriverLeaderboard } from "@/services/mongodb/models/DriverLeaderboardModel";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  leaderboard: IDriverLeaderboard[];
  fakes: IDriverLeaderboard[];
}

const EditDriversForm = ({ leaderboard, fakes }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [fakeDriver, setFakeDriver] = useState({
    name: "",
    surname: "",
    startingPoints: 0,
  });

  const handleAddFakeDriver = async () => {
    setLoading(true);
    try {
      await Admin_Axios.post("/leaderboard/fake-driver", fakeDriver);
      toast.success("ყალბი მძღოლი წარმატებით დაემატა");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add fake driver");
    }
    setLoading(false);
  };

  const deleteDriver = async (id: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const button = event.currentTarget;
    button.innerText = "იშლება...";
    try {
      await Admin_Axios.delete("/leaderboard/fake-driver/"+id);
      toast.success("ყალბი მძღოლი წაიშალა");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add fake driver");
    }
  };

  const pauseUnpause = async (id: string,paused:boolean) => {

    try {
      await Admin_Axios.put("/leaderboard/fake-driver/" + id, { paused });
      toast.success("შეიცვალა");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add fake driver");
    }
  };

  const resetLeaderboard = async () => {
    setResetLoading(true);
    try {
      await Admin_Axios.get("/leaderboard/reset");
      toast.success("ლიდერბორდი წარმატებით დარესტარტდა");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset leaderboard");
    }
    setResetLoading(false);
  };
  return (
    <div className="flex lg:w-1/2 flex-col gap-6">
      <h1>ლიდერბორდი</h1>
      <Button loading={resetLoading} onClick={resetLeaderboard}>
        დარესტარტება
      </Button>
      <h1>ყალბი მძღოლის დამატება</h1>
      <form className="grid grid-cols-2 gap-2">
        <Input label="სახელი" value={fakeDriver.name} onChange={(e) => setFakeDriver({ ...fakeDriver, name: e.target.value })} />
        <Input label="გვარი" value={fakeDriver.surname} onChange={(e) => setFakeDriver({ ...fakeDriver, surname: e.target.value })} />
        <Button loading={loading} className="col-span-2" onClick={handleAddFakeDriver}>
          დამატება
        </Button>
      </form>
      <h1>ყალბი მძღოლები</h1>
      {fakes
        .map((driver) => (
          <div key={driver._id} className="flex items-center gap-3">
            <p>{driver.name} {driver.surname}</p>
            <p>{Math.round(driver.currentPoints)}</p>
            <div className="flex items-center gap-2">
              <input onChange={(e)=>pauseUnpause(driver._id, e.target.checked)} type="checkbox" defaultChecked={driver.paused} />
              <p>პაუზა</p>
            </div>
            <button onClick={(e)=>deleteDriver(driver._id,e)} className="bg-red-700 rounded-md p-2 py-1">წაშლა</button>
          </div>
        ))}
      <h1>ლიდერბორდი</h1>
      {leaderboard.map((driver, i) => {
        return (
          <div key={driver._id} className={`flex items-center gap-2 ${driver.isFake ? "bg-red-200 bg-opacity-25" : ""}`}>
            <p>
              {i + 1} {")"}
            </p>
            <p>
              {driver.name} {driver.surname} |
            </p>
            <p>{Math.round(driver.currentPoints)} |</p>
            <p>{driver.phone || "NO PHONE"} |</p>
            <p>{driver.isFake ? "ყალბი" : "რეალური"}</p>
          </div>
        );
      })}
    </div>
  );
};

export default EditDriversForm;
