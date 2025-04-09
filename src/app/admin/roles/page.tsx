import { fetchData } from "~/lib/apiRequest";
import RoleManagerClient from "./_components/RoleManager";

const page = async () => {
  const roles = await fetchData("/roles");

  const roleData = roles.map((role) => ({
    id: role.id,
    name: role.name,
    parentId: role.parentId,
    userCount: Math.floor(Math.random() * 15) + 1,
  }));

  console.log("Role data:", roleData);

  return (
    <div>
      <RoleManagerClient roleData={roleData} />
    </div>
  );
};

export default page;
