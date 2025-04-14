// page.tsx
import { fetchData } from "~/lib/apiRequest";
import { isRolesArray } from "~/types";
import RoleManagerClient from "./_components/RoleManager";

const page = async () => {
  const roles = await fetchData("/roles");

  if (!isRolesArray(roles)) {
    console.error("Invalid roles data:", roles);
    return <div>Error: Invalid roles data</div>;
  }

  const roleData = roles.length
    ? roles.map((role) => ({
        id: role.id,
        name: role.name,
        parentId: role.parentId,
      }))
    : [];

  return (
    <div>
      <RoleManagerClient roleData={roleData} />
    </div>
  );
};

export default page;
