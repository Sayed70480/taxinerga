import { auth } from "@/auth";
import Content from "../custom_ui/Content";
import LangSwitch from "../functional/LangSwitch";
import Logo from "./Logo";
import Menu from "./Menu";
import AdminSignOut from "./AdminSignOut";

const Header = async () => {
  const session = await auth();
  const driver = session?.user;

  return (
    <div className="fixed left-0 right-0 top-0 z-[500]  bg-blue-500">
      <Content className="flex h-14 items-center px-4">
        <div className="h-16 w-full">
          <div className="flex h-full items-center justify-between">
            <Logo />
            <div className="flex items-center gap-3">
              <AdminSignOut />
              <LangSwitch />
              {Boolean(driver) && <Menu authorized={Boolean(driver)} />}
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default Header;
