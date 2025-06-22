import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import WithdrawModel from "@/services/mongodb/models/WithdrawModel";
import { I_WithdrawStruct } from "@/services/mongodb/models/WithdrawStructModel";

dayjs.extend(utc);
dayjs.extend(timezone);

interface CalculateCommissionParams {
  driverId: string;
  withdrawStruct: I_WithdrawStruct;
}

interface CommissionResult {
  commissionApply: boolean;
  commissionAmount: number;
}

export async function calculateCommission({ driverId, withdrawStruct }: CalculateCommissionParams): Promise<CommissionResult> {
  const { firstFreeWithdraw, fixed_commission, timeCommissionRules } = withdrawStruct;

  const userLastWithdraw = await WithdrawModel.findOne({
    driverId,
    status: { $in: ["completed", "pending"] },
  }).sort({ createdAt: -1 });

  const today = dayjs().tz("Asia/Tbilisi").format("DD.MM.YYYY");

  if (firstFreeWithdraw && userLastWithdraw) {
    const lastWithdrawDay = dayjs.utc(userLastWithdraw.createdAt).tz("Asia/Tbilisi").format("DD.MM.YYYY");

    if (lastWithdrawDay === today) {
      return {
        commissionApply: true,
        commissionAmount: fixed_commission,
      };
    } else {
      return {
        commissionApply: false,
        commissionAmount: 0,
      };
    }
  }

  if(firstFreeWithdraw && !userLastWithdraw){
    return {
      commissionApply: false,
      commissionAmount: 0,
    };
  }

  const now = dayjs().tz("Asia/Tbilisi");

  const matchingRule = timeCommissionRules?.find((rule) => {
    const from = dayjs.tz(now.format("YYYY-MM-DD") + " " + rule.from, "YYYY-MM-DD HH:mm", "Asia/Tbilisi");
    let to = dayjs.tz(now.format("YYYY-MM-DD") + " " + rule.to, "YYYY-MM-DD HH:mm", "Asia/Tbilisi");

    // Handle wrap-around for times like 20:00 - 00:00
    if (to.isBefore(from)) {
      to = to.add(1, "day");
    }

    return now.isAfter(from) && now.isBefore(to);
  });

  return {
    commissionApply: true,
    commissionAmount: matchingRule?.commission ?? fixed_commission,
  };
}
