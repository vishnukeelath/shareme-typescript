import { User } from "@/shared/types";
import { fetchUser } from "@/utils/fetchUser";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

const AdminPanel = (props: Props) => {
  const navigate = useNavigate();
  const [toggleSidebar, setToggleSidebar] = useState<Boolean>(false);
  const [user, setUser] = useState<User>();
  const scrollRef = useRef<HTMLInputElement>(null);

  const userInfo: User = fetchUser();
  console.log("userInfo - ", userInfo);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current?.scrollTo(0, 0);
    }
  }, []);

  return <div>AdminPanel</div>;
};

export default AdminPanel;
