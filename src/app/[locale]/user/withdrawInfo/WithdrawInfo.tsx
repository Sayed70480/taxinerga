import Content from "@/components/custom_ui/Content";
import { useTranslations } from "next-intl";
import { BsFillInfoCircleFill } from "react-icons/bs";

const WithdrawInfo = () => {
  const t = useTranslations("withdraw");
  return (
    <Content>
      <div className="mx-auto mt-4 w-full max-w-[432px] rounded-lg border-2 border-blue-400 bg-blue-400 bg-opacity-30 p-4 text-sm text-white">
        <BsFillInfoCircleFill className="float-left mr-2 mt-1 text-blue-400" />
        {t
          .raw("withdraw_info")
          .split("\n")
          .map((line: any, idx: any) => (
            <span key={idx}>
              {line}
              <br />
            </span>
          ))}
      </div>
    </Content>
  );
};

export default WithdrawInfo
