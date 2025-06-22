"use client";

import { userBalanceAtom } from "@/jotai/userBalanceAtom";
import { useAtom } from "jotai";
import { useEffect } from "react";

interface Props {
  balanceFromYandex: number;
}

const Balance = ({ balanceFromYandex }: Props) => {
  const [balance, setBalance] = useAtom(userBalanceAtom);
  useEffect(() => {
    setBalance(balanceFromYandex);
  }, [balanceFromYandex, setBalance]);
  return <p className="bg-darkGray w-fit text-yellow text-sm rounded-md p-2">{balance.toFixed(2)} ₾</p>;
};

export default Balance;
